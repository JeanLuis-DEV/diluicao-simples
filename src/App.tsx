import { useState, type FormEvent } from 'react'
import { Alert, Button, Card, Input, Modal, Select } from '@apps-simples/ui'
import { version } from '../package.json'
import AppLayout from './layouts/AppLayout'
import {
  DILUTION_PRESETS,
  calculateDilution,
  createDilutionExplanation,
  createDilutionPresentation,
  getDilutionErrorMessage,
  parseTotalAmount,
  parseWaterParts,
  type DilutionPresentation,
  type VolumeUnit,
} from './features/dilution'
import {
  INSTITUTIONAL_CONTENT,
  type InstitutionalContentId,
} from './features/institutional/content'
import WelcomeView from './features/onboarding/WelcomeView'
import { markWelcomeSeen, shouldShowWelcome } from './features/onboarding/onboardingStorage'
import PixSupport from './features/support/PixSupport'
import './App.css'

type RatioSelection = `${number}` | 'custom'

type FormErrors = {
  total?: string
  waterParts?: string
}

const PRIVACY_URL = 'https://jeanluis-dev.github.io/Central-de-Privacidade/apps/diluicao-simples.html'

export default function App() {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(shouldShowWelcome)
  const [ratio, setRatio] = useState<RatioSelection>('5')
  const [customWaterParts, setCustomWaterParts] = useState('')
  const [totalInput, setTotalInput] = useState('1000')
  const [unit, setUnit] = useState<VolumeUnit>('ml')
  const [errors, setErrors] = useState<FormErrors>({})
  const [result, setResult] = useState<DilutionPresentation | null>(null)
  const [explanation, setExplanation] = useState('')
  const [activeContent, setActiveContent] = useState<InstitutionalContentId | null>(null)
  const [supportOpen, setSupportOpen] = useState(false)

  function continueToApp() {
    markWelcomeSeen()
    setIsWelcomeVisible(false)
  }

  function invalidateResult() {
    setResult(null)
    setExplanation('')
  }

  function changeRatio(value: RatioSelection) {
    setRatio(value)
    setCustomWaterParts('')
    setErrors((current) => ({ ...current, waterParts: undefined }))
    invalidateResult()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    invalidateResult()

    const totalResult = parseTotalAmount(totalInput, unit)
    const waterPartsResult = parseWaterParts(ratio === 'custom' ? customWaterParts : ratio)
    const nextErrors: FormErrors = {
      total: totalResult.ok ? undefined : getDilutionErrorMessage(totalResult.error, unit),
      waterParts: waterPartsResult.ok
        ? undefined
        : getDilutionErrorMessage(waterPartsResult.error, unit),
    }

    setErrors(nextErrors)
    if (!totalResult.ok || !waterPartsResult.ok) return

    const calculation = calculateDilution({
      totalMl: totalResult.value.totalMl,
      waterParts: waterPartsResult.value,
    })

    if (!calculation.ok) {
      const message = getDilutionErrorMessage(calculation.error, unit)
      setErrors(calculation.error.field === 'total' ? { total: message } : { waterParts: message })
      return
    }

    const presentation = createDilutionPresentation(
      calculation.value,
      unit,
      totalResult.value.sourceDecimalPlaces,
    )
    setResult(presentation)
    setExplanation(createDilutionExplanation(calculation.value, presentation))
  }

  const institutionalContent = activeContent ? INSTITUTIONAL_CONTENT[activeContent] : null

  if (isWelcomeVisible) {
    return (
      <AppLayout appName="Diluição Simples">
        <WelcomeView onContinue={continueToApp} />
      </AppLayout>
    )
  }

  return (
    <AppLayout
      appName="Diluição Simples"
      footer={
        <div className="institutional-actions" aria-label="Informações institucionais">
          <span>© Jean Luis DEV · v{version}</span>
          <div className="institutional-actions__buttons">
            <Button size="compact" variant="ghost" onClick={() => setActiveContent('about')}>Sobre</Button>
            <Button size="compact" variant="ghost" onClick={() => setActiveContent('rights')}>Direito de uso</Button>
            <Button size="compact" variant="ghost" onClick={() => setActiveContent('privacy')}>Privacidade</Button>
            <Button size="compact" variant="ghost" onClick={() => setSupportOpen(true)}>Ajude o projeto</Button>
          </div>
        </div>
      }
    >
      <div className="dilution-page">
        <header className="page-intro">
          <h1>Diluição Simples</h1>
          <p>Calcule quanto produto concentrado e água usar para preparar a quantidade final desejada.</p>
        </header>

        <Card className="calculator-card">
          <form className="calculator-form" noValidate onSubmit={handleSubmit}>
            <Select
              label="Proporção"
              value={ratio}
              helperText={ratio === 'custom'
                ? 'Informe quantas partes de água serão usadas para 1 parte de produto.'
                : `1 parte de produto para ${ratio} ${ratio === '1' ? 'parte' : 'partes'} de água.`}
              onChange={(event) => changeRatio(event.target.value as RatioSelection)}
            >
              {DILUTION_PRESETS.map((preset) => (
                <option key={preset} value={preset}>1:{preset}</option>
              ))}
              <option value="custom">Personalizada</option>
            </Select>

            {ratio === 'custom' && (
              <Input
                id="custom-water-parts"
                label="Partes de água"
                value={customWaterParts}
                inputMode="decimal"
                autoComplete="off"
                placeholder="Exemplo: 2,5"
                helperText="Use até 3 casas decimais."
                error={errors.waterParts}
                onChange={(event) => {
                  setCustomWaterParts(event.target.value)
                  setErrors((current) => ({ ...current, waterParts: undefined }))
                  invalidateResult()
                }}
              />
            )}

            <div className="amount-fields">
              <Input
                id="total-amount"
                label="Quantidade final"
                value={totalInput}
                inputMode="decimal"
                autoComplete="off"
                placeholder="Exemplo: 1000"
                helperText={unit === 'ml' ? 'Exemplo: 1000 ml (1 litro).' : 'Exemplo: 1 L (1000 ml).'}
                error={errors.total}
                onChange={(event) => {
                  setTotalInput(event.target.value)
                  setErrors((current) => ({ ...current, total: undefined }))
                  invalidateResult()
                }}
              />

              <Select
                label="Unidade"
                value={unit}
                onChange={(event) => {
                  setUnit(event.target.value as VolumeUnit)
                  setErrors((current) => ({ ...current, total: undefined }))
                  invalidateResult()
                }}
              >
                <option value="ml">ml</option>
                <option value="L">L</option>
              </Select>
            </div>

            <Button className="calculate-button" type="submit">Calcular</Button>
          </form>
        </Card>

        <section className="result-region" aria-live="polite" aria-atomic="true">
          {result && (
            <Card className="result-card" variant="highlight">
              <div className="result-card__heading">
                <p className="eyebrow">Resultado</p>
                <h2>Para preparar {result.totalText} {result.unit}</h2>
              </div>
              <dl className="result-values">
                <div>
                  <dt>Produto concentrado</dt>
                  <dd>{result.productText} {result.unit}</dd>
                </div>
                <div>
                  <dt>Água</dt>
                  <dd>{result.waterText} {result.unit}</dd>
                </div>
              </dl>
              <p className="result-explanation">{explanation}</p>
            </Card>
          )}
        </section>

        <Alert type="warning" title="Confira o rótulo">
          A interpretação da proporção pode variar conforme o fabricante. Consulte o rótulo do produto.
        </Alert>
      </div>

      <Modal
        open={institutionalContent != null}
        onClose={() => setActiveContent(null)}
        title={institutionalContent?.title ?? 'Informações'}
        footer={(
          <div className="modal-footer-actions">
            <Button variant="secondary" onClick={() => setActiveContent(null)}>Fechar</Button>
          </div>
        )}
      >
        <div className="readable-content" lang="pt-BR">
          {institutionalContent?.sections.map((section) => (
            <section className="institutional-content" key={section.heading}>
              <h3>{section.heading}</h3>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          {activeContent === 'privacy' && (
            <p className="privacy-link">
              <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Abrir a Central de Privacidade</a>
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        title="Ajude o projeto"
        footer={(
          <div className="modal-footer-actions">
            <Button variant="secondary" onClick={() => setSupportOpen(false)}>Fechar</Button>
          </div>
        )}
      >
        <PixSupport />
      </Modal>
    </AppLayout>
  )
}
