const ANO_ATUAL = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="brand__mark" aria-hidden="true">
            🍔
          </span>
          <div>
            <strong>Brasa Burger</strong>
            <p>Hamburgueria artesanal</p>
          </div>
        </div>

        <div className="footer__info">
          <div>
            <h3>Endereço</h3>
            <p>
              Rua das Brasas, 123
              <br />
              Vila Mariana — São Paulo/SP
            </p>
          </div>

          <div>
            <h3>Horário</h3>
            <p>
              Todos os dias
              <br />
              18h às 23h30
            </p>
          </div>

          <div>
            <h3>Contato</h3>
            <p>
              <a href="https://wa.me/5511999990000">(11) 99999-0000</a>
              <br />
              <a href="https://instagram.com/brasaburger">@brasaburger</a>
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <small>© {ANO_ATUAL} Brasa Burger. Todos os direitos reservados.</small>
        <small>
          Imagens ilustrativas. Consulte os alergênicos no detalhe de cada
          produto.
        </small>
      </div>
    </footer>
  )
}
