import styled from 'styled-components'
import MainGrid from '../src/Componentes/MainGrid/Index'
import Box from '../src/Componentes/Box/Index'
import {AlurakutMenu, OrkutNostalgicIconSet} from '../src/lib/AluraCommons'
import {ProfileRelationsBoxWrapper} from '../src/Componentes/ProfileRelations'

function ProfileSidebar(propriedade) {
  return (
    <Box>
        <img src={`https://github.com/${propriedade.GitHubUser}.png`} style={{borderRadius: '8px'}}></img>      
    </Box>
  );
};

export default function Home() {
const GitHubUser = "omariosouto";
const PessoasFavoritas = [
  "juunegreiros",
  "omariosouto",
  "peas",
  "rafaballerini",
  "marcobrunodev",
  ]
  
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
    </div>
    <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          Pessoas da Comunidade ({PessoasFavoritas.length})
        </h2>
        <ul>
        {             
            PessoasFavoritas.map((itemAtual) => {
              return (
                <li>
                  <a href={`/users/${itemAtual}`} key={itemAtual}>
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
