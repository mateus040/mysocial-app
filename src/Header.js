import { useEffect, useState } from "react";
import { auth, storage, db } from './firebase.js';
import firebase from 'firebase/compat/app';
import Swal from 'sweetalert2';

function Header(props) {

    // Barra de progresso
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    useEffect(() => {

    }, [])

    // Função criar conta
    function criarConta(e) {
        e.preventDefault();
        let email = document.getElementById('email-cadastro').value;
        let username = document.getElementById('username-cadastro').value;
        let senha = document.getElementById('senha-cadastro').value;
    
        auth.createUserWithEmailAndPassword(email, senha)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: username
                });
    
                Swal.fire({
                    title: "Conta criada com sucesso!",
                    text: "Clique no botão para continuar!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        props.setUser(authUser.user.displayName);
                        fecharModalCriarConta();
                    }
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: "Erro ao Criar Conta",
                    text: "Verifique se o e-mail e a senha estão no formato correto!",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            });
    }

    // Função logar
    function logar(e) {
        e.preventDefault();
        let email = document.getElementById('email-login').value;
        let senha = document.getElementById('senha-login').value;

        Swal.fire({
            title: "Logado com Sucesso!",
            text: "Clique no botão para continuar!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
        }).then((result) => {
            if (result.isConfirmed) {
                auth.signInWithEmailAndPassword(email, senha)
                    .then((auth) => {
                        props.setUser(auth.user.displayName);
                    }).catch((error) => {
                        Swal.fire({
                            title: "Erro no login",
                            text: "Ocorreu um erro ao fazer login. Tente novamente!",
                            icon: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "OK",
                        });
                    });

                    fecharModalLogin();
            }
        });
    }

    // Função deslogar
    function deslogar(e) {
        e.preventDefault();

        Swal.fire({
            title: 'Confirmar logout',
            text: 'Tem certeza que deseja sair?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                auth.signOut()
                    .then(() => {
                        props.setUser(null);
                        window.location.href = "/";
                    }).catch((error) => {
                        Swal.fire('Erro', 'Ocorreu um erro ao fazer logout.', 'error');
                    })
            }
        })
    }

    // Função para abrir modal de upload
    function abrirModalUpload(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalUpload');

        modal.style.display = "block";
    }

    // Função para fechar modal de upload
    function fecharModalUpload(e) {
        let modal = document.querySelector('.modalUpload');

        modal.style.display = "none";
    }

    // Função para fazer Upload
    function uploadPost(e) {
        e.preventDefault();

        let tituloPost = document.getElementById('titulo-upload').value;

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on("state_changed", function (snapshot) {
            const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, function (error) {

        }, function () {

            storage.ref("images").child(file.name).getDownloadURL()
                .then(function (url) {
                    db.collection('posts').add({
                        titulo: tituloPost,
                        image: url,
                        userName: props.user,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })

                    // Zerando o progresso e o arquivo
                    setProgress(0);
                    setFile(null);

                    alert('Upload Realizado com Sucesso!');

                    // Resetando o formulário
                    document.getElementById('form-upload').reset();
                    fecharModalUpload();

                })
        })
    }

    // Função para abrir a modal de criação de conta
    function abrirModalCriarConta(e) {
        e.preventDefault();

        let modal = document.querySelector('.area-criarConta');
        document.querySelector('.area-login').style.display = "none";

        modal.style.display = "block";
    }

    // Função para fechar a modal de criação de conta
    function fecharModalCriarConta() {
        let modal = document.querySelector('.area-criarConta');

        modal.style.display = "none";
    }

    // Função para abrir a modal de login
    function abrirModalLogin(e){
        e.preventDefault();

        let modal = document.querySelector(".area-login");

        modal.style.display = "block";
    }

    // Função para fechar a modal de login
    function fecharModalLogin(e){
        let modal = document.querySelector(".area-login");

        modal.style.display = "none";
    }

    return (
        <div className='header'>

            <div className="area-criarConta">
                <div className="login">
                    <img src={process.env.PUBLIC_URL + '/images/logo.png'}></img>

                    <div onClick={() => fecharModalCriarConta()} className="close-modal-criar">X</div>


                    <form id="form-criarConta" onSubmit={(e) => criarConta(e)}>
                        <input id="username-cadastro" type="text" placeholder="Username" />
                        <input id="email-cadastro" type="text" placeholder="E-mail" />
                        <input id="senha-cadastro" type="password" placeholder="Senha (mín: 6 dígitos)" />
                        <input type="submit" value="Criar Conta!" />
                    </form>
                </div>

            </div>

            <div className="area-login">
                <div className="login">
                    <img src={process.env.PUBLIC_URL + '/images/logo.png'}></img>

                    <div onClick={() => fecharModalLogin()} className="close-modal-criar">X</div>


                    <form id="form-criarConta" onSubmit={(e) => logar(e)}>
                        <input id="email-login" type="text" placeholder="E-mail" />
                        <input id="senha-login" type="password" placeholder="Senha" />
                        <input type="submit" value="Logar" />
                    </form>
                    <p>Ainda não tem uma conta?<a onClick={(e) => abrirModalCriarConta(e)}>Criar Conta!</a></p>
                </div>

            </div>



            <div className="modalUpload">
                <div className="formUpload">
                    <div onClick={() => fecharModalUpload()} className="close-modal-criar">X</div>
                    <h2>Fazer Upload</h2>
                    <form id="form-upload" onSubmit={(e) => uploadPost(e)}>
                        <progress id="progress-upload" value={progress}></progress>
                        <input id="titulo-upload" type="text" placeholder="Nome da sua foto..." />
                        <input onChange={(e) => setFile(e.target.files[0])} type="file" name="file" />
                        <input type="submit" value="Postar no Instagram!" />
                    </form>
                </div>
            </div>

            <div className='center'>
                <div className='header__logo'>
                    <a href=''><img src={process.env.PUBLIC_URL + '/images/logo.png'}></img></a>
                </div>

                {
                    (props.user) ?
                        <div className="header__logadoInfo">
                            <span>Olá <b>{props.user}</b></span>
                            <a href='#' onClick={(e) => abrirModalUpload(e)}>Postar!</a>
                            <a onClick={(e) => deslogar(e)}>Deslogar</a>
                        </div>
                        :
                        <div className='header__loginForm'>
                            <form onSubmit={(e) => logar(e)}>
                                <input onClick={(e) => abrirModalLogin(e)} type="button" name='acao' value='Entrar' />
                            </form>
                            <div className="btn__criarConta">
                                <input onClick={(e) => abrirModalCriarConta(e)} type="button" value='Criar Conta' />
                            </div>
                        </div>
                }

            </div>
        </div>
    )
}

export default Header;