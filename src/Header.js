import { useEffect, useState } from "react";

function Header(props) {

    useEffect(() => {
        props.setUser("João");
    }, [])

    return (
        <div className='header'>
            <div className='center'>
                <div className='header__logo'>
                    <a href=''><img src={process.env.PUBLIC_URL + '/images/logo.png'}></img></a>
                </div>

                {
                    (props.user) ?
                        <div className="header__logadoInfo">
                            <span>Olá <b>{props.user}</b></span>
                            <a href="#">Postar!</a>
                        </div>
                        :
                        <div className='header__loginForm'>
                            <form>
                                <input type='text' placeholder='E-mail:' />
                                <input type='password' placeholder='Senha:' />
                                <input type='submit' name='acao' value='Entrar' />
                            </form>
                            <div className="btn__criarConta">
                                <a href="">Criar Conta!</a>
                            </div>
                        </div>
                }

            </div>
        </div>
    )
}

export default Header;