import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth, storage, db } from '../firebase';

import '../styles/Home.css';
import IconSoloMeetTEA from '../icons/icon-solo-meet-tea.png';

const Home = (props) => {
    const [openModalPublicar, setOpenModalPublicar] = useState(false);
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showChat, setShowChat] = useState(false); // Estado para controlar exibição do iframe

    useEffect(() => {
        if (openModalVisualizar) {
            db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
                setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data()
                })));
            });
        }
    }, [openModalVisualizar]);

    if (!props.user) {
        return <Navigate to="/" />;
    }

    const uploadPost = (e) => {
        e.preventDefault();

        let titlePost = document.getElementById("titlePost").value;
        let descricaoPost = document.getElementById("descricaoPost").value;

        if (!file) {
            alert("Selecione um arquivo para upload");
            return;
        }

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                console.error("Erro no upload:", error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(file.name)
                    .getDownloadURL()
                    .then((url) => {
                        db.collection("posts").add({
                            title: titlePost,
                            description: descricaoPost,
                            imageUrl: url,
                            timestamp: new Date(),
                            user: props.user,
                        });

                        setProgress(0);
                        setFile(null);
                        setOpenModalPublicar(false);
                    });
            }
        );
    }

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                console.log("Usuário deslogado com sucesso");
                window.location.href = '/'; // Redireciona para a raiz
            })
            .catch((error) => {
                console.error("Erro ao tentar deslogar:", error);
            });
    };

    const handleOpenChat = () => {
        setShowChat(!showChat); // Alternar estado para mostrar ou esconder o iframe
    };

    return (
        <div className="container-home">
            <div className="header">
                <h1 className="title">
                    <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={IconSoloMeetTEA} width={100} style={{ margin: '0 10px' }} />
                        MEET TEA
                        <img style={{ margin: '0 10px' }} src={IconSoloMeetTEA} width={100} />
                    </h1>
                </h1>
            </div>

            <p>Olá, {props.user}!</p>

            <button className="btn-post" onClick={() => setOpenModalPublicar(!openModalPublicar)}>
                {openModalPublicar ? 'Fechar' : 'Postar'} Publicação
            </button>
            <button className="btn-post" onClick={() => setOpenModalVisualizar(!openModalVisualizar)}>
                {openModalVisualizar ? 'Fechar' : 'Visualizar'} Posts
            </button>
            <button className="btn-post" onClick={handleOpenChat}>
                {showChat ? 'Fechar' : 'Abrir'} Chat MEET TEA
            </button>
            <button className="btn-post" onClick={handleLogout}>Sair</button>

            {showChat && <iframe src="https://meet-tea-3db7c.web.app/" style={{ width: '100%', height: '100vh' }} />}

            {openModalPublicar &&
                <div id="container-publicar" className="modal-publicar">
                    <form onSubmit={(e) => uploadPost(e)}>
                        <progress value={progress} id="progress" max="100"></progress>

                        <label>Título</label>
                        <input type="text" id="titlePost" placeholder="Insira um Título para sua Publicação..." />

                        <label>Imagem:</label>
                        <input type="file" id="imagePost" onChange={(e) => setFile(e.target.files[0])} placeholder="Image..." />

                        <label>Descrição</label>
                        <textarea placeholder="Insira uma descrição para sua publicação..." id="descricaoPost"></textarea>

                        <button type="submit">Publicar</button>
                        <button type="button" onClick={() => setOpenModalPublicar(false)}>Fechar Publicação</button>
                    </form>
                </div>
            }

            {openModalVisualizar &&
                <div id="container-visualizar" className="modal-visualizar">
                    {posts.map(({ id, post }) => (
                        <div key={id} className="post">
                            <h3>{post.title}</h3>
                            <img src={post.imageUrl} alt={post.title} width="100%" />
                            <p>{post.description}</p>
                            <p>Usuário: <strong>{post.user}</strong></p>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default Home;
