const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://buscacepinter.correios.com.br/app/endereco/index.php');

    const resultado = await page.evaluate(async () => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        document.getElementById('endereco').value = '60811341'
        await sleep(300) //aguardar 300ms
        document.getElementById('btn_pesquisar').click()
        await sleep(1000) //aguardar 1000ms

        if (document.getElementById('mensagem-resultado').innerText == 'Resultado da Busca por Endereço ou CEP') { // Isso significa que foi retornado resultado
            const tabela = document.getElementById('resultado-DNEC')
            const logradouro = tabela.childNodes[3].childNodes[1].childNodes[0].innerHTML
            const bairro = tabela.childNodes[3].childNodes[1].childNodes[1].innerHTML
            const cidade = tabela.childNodes[3].childNodes[1].childNodes[2].innerHTML.split('/')[0]
            const uf = tabela.childNodes[3].childNodes[1].childNodes[2].innerHTML.split('/')[1]
            return {
                status: {
                    success: true,
                    message: null
                },
                logradouro,
                bairro,
                cidade,
                uf
            }
        } else { // Isso significa que não há resultados válidos
            return {
                status: {
                    success: false,
                    message: 'Não foi possível encontrar o CEP informado.'
                }
            }
        }
    })

    if (resultado.status.success) {
        console.log(`Logradouro: ${resultado.logradouro}\nBairro: ${resultado.bairro}\nCidade: ${resultado.cidade} (${resultado.uf})`)
    } else {
        console.log('Erro: ' + resultado.status.message)
    }

    await browser.close();
})();