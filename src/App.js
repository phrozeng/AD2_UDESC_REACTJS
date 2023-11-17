// Import de bibliotecas
import './App.css';
import {BrowserRouter, Routes, Route, Outlet, Link, useNavigate, useParams} from "react-router-dom";
import { useState , useEffect } from 'react';

// Define o endereço do servidor
const endereco_servidor = 'http://localhost:8000';

/**
 * Layout do menu.
 * 
 * @returns 
 */
function Layout(){
  
  // Renderiza o componente
  return (
    <>
      <h1>Menu principal</h1>
      <nav>      
        <ol>
          <li>
            <Link to="/frmcadastroaluno/-1">
              Incluir
            </Link>
          </li>         
          <li>
            <Link to="/frmlistaraluno">
              Listar(Alterar, Excluir)
            </Link>
          </li>          
        </ol>  
        <hr />      
      </nav>
      <Outlet />
    </>
  )
};

/**
 * Opção de página não encontrada.
 * 
 * @returns 
 */
function NoPage() {
  
  // Renderiza o componente
  return (
      <div>
        <h2>404 - Página não encontrada</h2>
      </div>
    );
};

/**
 * Componente formulário que insere ou altera aluno.
 * 
 * @returns 
 */
function FrmCadastroAluno(){

  // Recupera o parâmetro do componente
  const { alterarId } = useParams();

  // Estados inciais das variáveis do componente   
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [turma, setTurma] = useState('');
  const [datanascimento, setDatanascimento] = useState('');
  const [resultado, setResultado] = useState('');  

  // Renderiza a lista de alunos.
  useEffect(() => {
    
    // Recupera um aluno para alteração
    const getAluno = async () => {
      //Se foi passado um parametro
      if (alterarId > 0) {      
        //Consulta o aluno
        const response = await fetch(`${endereco_servidor}/aluno/${alterarId}`);
        const data = await response.json();
        //Atualiza os dados        
        setNome(data.nome);
        setCpf(data.cpf);
        setResponsavel(data.responsavel);
        setTurma(data.turma);
        setDatanascimento(data.datanascimento);
      }      
    };

    //Se tem algum aluno para alterar, busca os dados do aluno.    
    getAluno(); 
  }, [alterarId]);

  // Submissão do formulário para inserir.
  const handleSubmitInsert = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    //Dados do formulário a serem enviados
    const dados =  { 
          //'alunoId': alunoId,
          'nome': nome,
          'cpf': cpf,
          'responsavel': responsavel,
          'turma': turma,
          'datanascimento':datanascimento
    }

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/aluno`, {
        method : 'post',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Submissão do formulário atualizar.
  const handleSubmitUpdate = (event) => {

    // Impede o recarregamento da página
    event.preventDefault();   
    
    const dados =  { 
          'nome': nome,
          'cpf': cpf,
          'responsavel': responsavel,
          'turma': turma,
          'datanascimento': datanascimento
    };

    //Endereço da API + campos em JSON
    fetch(`${endereco_servidor}/aluno/${alterarId}`, {
        method : 'put',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte a resposta para JSON
       .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
  
    // Limpa os campos do formulário.
    limpar();
  };

  // Limpa os campos do formulário.     
  const limpar = () => {     
    setNome('');
    setCpf('');
    setResponsavel('');
    setTurma('');
    setDatanascimento('');
  };

  // Renderiza o componente formulário
  return (
    <>      
      <form name="FrmCadastroAluno" method="post" onSubmit={alterarId < 0 ? handleSubmitInsert: handleSubmitUpdate}>
          <label><h2> {(alterarId < 0) ? (<div>1 - Formulário Cadastro Aluno</div>) : (<div>1 - Formulário Alteração Aluno</div>)} </h2></label>          
          <label>Nome: 
          <input type="text" size="60" id="nome" name="nome" value={nome} onChange={(event) => setNome(event.target.value)} /></label><br/>
          <label>CPF: 
          <input type="text" size="15" id="cpf" name="cpf" value={cpf} onChange={(event) => setCpf(event.target.value)} /></label><br/>
          <label>Responsavel: 
          <input type="text" size="60" id="responsavel" name="responsavel" value={responsavel} onChange={(event) => setResponsavel(event.target.value)} /></label><br/>
          <label>Turma 
          <input type="text" size="10" id="turma" name="turma" value={turma} onChange={(event) => setTurma(event.target.value)} /></label><br/>
          <label>Data de Nascimento: 
          <input type="text" size="10" id="datanascimento" name="datanascimento" value={datanascimento} onChange={(event) => setDatanascimento(event.target.value)} /></label><br/>    
          <input type="button" name="Limpar" value="Limpar" onClick={limpar} />
          <input type="submit" name="Cadastrar" value="Cadastrar"/><br/><br/>
          <label>Resultado: {resultado} </label>
      </form>
    </>
  );
};

/**
 * Componente de exclusão de aluno.
 * 
 * @returns 
 */
function FrmExcluirAluno() {

  // Recupera o parâmetro do componente
  const { alunoId } = useParams();

  // Estados inciais das variáveis do componente
  const [resultado, setResultado] = useState('');
  
  // Renderiza a lista de alunos.
  useEffect(() => {

    // Exclui um aluno
    const excluirAluno = async () => {
      //Endereço da API + campos em JSON
      fetch(`${endereco_servidor}/aluno/${alunoId}`, {method : 'delete'}) 
      .then((response) => response.json()) //Converte a resposta para JSON
      .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
    };

    excluirAluno();
  }, [alunoId]);

  // Renderiza o componente
  return (
    <div>      
       <label>Resultado: {resultado} </label>
    </div>
  );
}

/**
 * Componente de listagem de alunos.
 * 
 * @returns 
 */
function FrmListarAluno(){
  
  // Estados inciais das variáveis do componente
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState([])
  
  // Renderiza a lista de Alunos.
  useEffect(() => {
    // Busca os Alunos cadastrados no servidor.
    const getAlunos = () => {
      fetch(`${endereco_servidor}/alunos`)
        .then(response => {return response.json()}) //Converte a resposta para JSON
        .then(data => {setAlunos(data)}) // Atribui a resposta ao Aluno
    };

    getAlunos();
  }, []);

  // Renderiza o componente
  return (
    <div>
        <h2>2 - Listar(Editar, Excluir)</h2>        
        <div>
          <table border='1'> 
            <td>Id</td> <td>Nome</td> <td>CPF</td> <td>Responsavel</td><td>Turma</td><td>Data de Nascimento</td><td>Editar</td> <td>Excluir</td>          
            {alunos.map(aluno => (
              <tr>
                <td> {aluno.alunoId} </td>
                <td> {aluno.nome}</td>
                <td> {aluno.cpf}</td>
                <td> {aluno.responsavel}</td>
                <td> {aluno.turma}</td>
                <td> {aluno.datanascimento}</td>
                <td> 
                  <button onClick={() => {navigate(`/frmcadastroaluno/${aluno.alunoId}`)}}>Editar</button>
                </td>                
                <td>                  
                  <button onClick={() => {navigate(`/frmexcluiraluno/${aluno.alunoId}`)}}>Excluir</button>
                </td>
              </tr>
            ))}
          </table>
          <br/>          
        </div>
     </div>
  );
}

/**
 * Principal componente da aplicação.
 * 
 * @returns 
 */
function MenuPrincipal() {
    return (      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='frmcadastroAluno/:alterarId' element={<FrmCadastroAluno />} />
            <Route path='frmexcluiraluno/:alunoId' element={<FrmExcluirAluno />} />
            <Route path='frmlistaraluno' element={<FrmListarAluno />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>        
      </BrowserRouter>    
    );
  }
  
  export default MenuPrincipal;