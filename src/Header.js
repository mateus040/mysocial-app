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

        // Criar conta firebase
        auth.createUserWithEmailAndPassword(email, senha)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: username
                })
                alert('Conta criada com sucesso!');
                let modal = document.querySelector('.modalCriarConta');

                modal.style.display = "none";
            }).catch((error) => {
                alert(error.message);
            })
            ;

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

        let modal = document.querySelector('.modalCriarConta');

        modal.style.display = "block";
    }

    // Função para fechar a modal de criação de conta
    function fecharModalCriar() {
        let modal = document.querySelector('.modalCriarConta');

        modal.style.display = "none";
    }

    return (
        <div className='header'>

            <div className="modalCriarConta">
                <div className="formCriarConta">
                    <div onClick={() => fecharModalCriar()} className="close-modal-criar">X</div>
                    <h2>Criar Conta</h2>
                    <form onSubmit={(e) => criarConta(e)}>
                        <input id="email-cadastro" type="text" placeholder="Seu e-mail..." />
                        <input id="username-cadastro" type="text" placeholder="Seu username..." />
                        <input id="senha-cadastro" type="password" placeholder="Sua senha..." />
                        <input type="submit" value="Criar Conta!" />
                    </form>
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
                                <input id="email-login" type='text' placeholder='E-mail:' />
                                <input id="senha-login" type='password' placeholder='Senha:' />
                                <input type='submit' name='acao' value='Entrar' />
                            </form>
                            <div className="btn__criarConta">
                                <a onClick={(e) => abrirModalCriarConta(e)} href="#">Criar Conta</a>
                            </div>
                        </div>
                }

            </div>
        </div>
    )
}

export default Header;