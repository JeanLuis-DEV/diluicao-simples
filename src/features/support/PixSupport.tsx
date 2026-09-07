import { Card } from '@apps-simples/ui'
import { APP_INFO } from '../../config/appInfo'
import PixSupportAction from './PixSupportAction'

export default function PixSupport() {
  return (
    <Card className="support-card" variant="highlight">
      <div className="support-card__heading">
        <h2>Apoiar o projeto</h2>
        <p>Contribuição via Pix. O valor é livre. Obrigado por ajudar a manter o {APP_INFO.name} em evolução.</p>
      </div>

      <dl className="pix-details">
        <div>
          <dt>Tipo</dt>
          <dd>{APP_INFO.pix.type}</dd>
        </div>
        <div>
          <dt>Chave Pix</dt>
          <dd className="pix-key">{APP_INFO.pix.key}</dd>
        </div>
        <div>
          <dt>Titular</dt>
          <dd>{APP_INFO.pix.holder}</dd>
        </div>
        <div>
          <dt>Banco</dt>
          <dd>{APP_INFO.pix.bank}</dd>
        </div>
      </dl>

      <div className="support-card__actions">
        <PixSupportAction label="Copiar chave Pix" />
      </div>
    </Card>
  )
}
