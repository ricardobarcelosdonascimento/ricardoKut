import styled from 'styled-components'
import MainGrid from '../src/Componentes/MainGrid/index'
import Box from '../src/Componentes/Box/index'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AluraCommons'
import {ProfileRelationsBoxWrapper} from '../src/Componentes/ProfileRelations/index'
import {useState, useEffect} from 'react'
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

function ProfileSidebar(propriedade) {
  return (
    <Box as="aside">
        <img src={`https://github.com/${propriedade.githubUser}.png`} style={{borderRadius: '8px'}}></img>    
        <hr/>
        <p>
          <a className="boxLink" href={`https://github.com/${propriedade.githubUser}`}>
            @{propriedade.githubUser}
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

export default function Home(props) {
  const usuarioAleatorio = props.githubUser;
const [Comunidades, setComunidades] = useState([]);
//const GitHubUser = props.GitHubUser;
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

     // API GraphQL
     fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '36488dd295430a37f85b7f484f272a',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })
    // .then(function (response) {
    //   return response.json()
    // })

  }, [])

  console.log('seguidores antes do return', seguidores);
  
  return (
    <>
    <AlurakutMenu />
    <MainGrid>
    <div className="profileArea" style={{gridArea: 'profileArea'}}>
    <ProfileSidebar githubUser={usuarioAleatorio} />
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
            title: dadosDoForm.get("title"),
            image: dadosDoForm.get("image"),
            image_Url: dadosDoForm.get('image'),
            creator_Slug: usuarioAleatorio,
          }
          
          const ComunidadesAtualizada = [...Comunidades, comunidade]
          setComunidades(ComunidadesAtualizada)
          
          fetch('/api/comunidades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(comunidade)
          })
          .then(async (response) => {
            const dados = await response.json();
            console.log(dados.registroCriado);
            const comunidade = dados.registroCriado;
            const comunidadesAtualizadas = [...Comunidades, comunidade];
            setComunidades(comunidadesAtualizadas)
          })

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
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
} 
