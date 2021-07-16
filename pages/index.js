import styled from 'styled-components'
import MainGrid from '../src/Componentes/MainGrid/index'
import Box from '../src/Componentes/Box/index'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AluraCommons'
import {ProfileRelationsBoxWrapper} from '../src/Componentes/ProfileRelations/index'
import {useState, useEffect} from 'react'

function ProfileSidebar(propriedade) {
  return (
    <Box as="aside">
        <img src={`https://github.com/${propriedade.GitHubUser}.png`} style={{borderRadius: '8px'}}></img>    
        <hr/>
        <p>
          <a className="boxLink" href={`https://github.com/${propriedade.GitHubUser}`}>
            @{propriedade.GitHubUser}
          </a> 
        </p>
        
        <hr/>

        <AlurakutProfileSidebarMenuDefault/>
    </Box>
  );
};

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
const [Comunidades, setComunidades] = useState([{
  id: '12802378123789378912789789123896123', 
  title: 'Eu odeio acordar cedo',
  image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
}]);
const GitHubUser = "omariosouto";
const PessoasFavoritas = [
  "juunegreiros",
  "omariosouto",
  "peas",
  "rafaballerini",
  "marcobrunodev",
  "felipefialho"
  ]

  const [seguidores, setSeguidores] = useState([]);
  
  // 0 - Pegar o array de dados do github 
  useEffect(function() {
    fetch('https://api.github.com/users/peas/followers')
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    })
  }, [])

  console.log('seguidores antes do return', seguidores);
  
  return (
    <>
    <AlurakutMenu />
    <MainGrid>
    <div className="profileArea" style={{gridArea: 'profileArea'}}>
      <ProfileSidebar GitHubUser={GitHubUser}/>
    </div>
    <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
      <Box>
        Bem vindo(a)
        <OrkutNostalgicIconSet />
      </Box>

      <Box>
        <h2 className="subtitle">O que você deseja fazer?</h2>
        <form onSubmit={function handleCriarComunidade(evento) {
          evento.preventDefault()
          const dadosDoForm = new FormData(evento.target)
          const comunidade = {
            id: new Date().toISOString,
            title: dadosDoForm.get("title"),
            image: dadosDoForm.get("image")
          }
          
          const ComunidadesAtualizada = [...Comunidades, comunidade]
          setComunidades(ComunidadesAtualizada)
          console.log(Comunidades)
        }}>
          <div>
            <input placeholder="Qual vai ser o nome da sua comunidade?"
            name="title"
            aria-label="Qual vai ser o nome da sua comunidade?"
            type="text"/>
          </div>
          <div>
            <input placeholder="Coloque uma URL para usarmos de capa"
            name="image"
            aria-label="Coloque uma URL para usarmos de capa?"/>
          </div>
          <button>
            Criar comunidade
          </button>
        </form>
      </Box>
    </div>
    <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
      <ProfileRelationsBox title="Seguidores" items={seguidores} />
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          Comunidades ({Comunidades.length})
        </h2>
        <ul>
          {             
              Comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                        <img src={itemAtual.image} />
                        <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )  
              })                
          }
        </ul> 
      </ProfileRelationsBoxWrapper>
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          Pessoas da Comunidade ({PessoasFavoritas.length})
        </h2>
        <ul>
        {             
            PessoasFavoritas.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                  </a>
                </li>
              )  
            })                
        }
        </ul> 
      </ProfileRelationsBoxWrapper>
    </div>
  </MainGrid>
  </>
  );
}
