"use strict";
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mysql = require('mysql');
const SocketIOFile = require('socket.io-file');
const querystring = require('querystring');
const formidable = require('formidable');
const fs = require('fs');
const cors = require('cors');

const multer = require('multer');
const DIR = './public/uploads/';
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, DIR);
  },
  filename: function(req, file, cb) {
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  }
});
const upload = multer({ storage: storage }).single('foto');


const con = mysql.createConnection({
  host: "angeloethiago.com.br",
  port: 3306,
  user: "angeloet_root",
  password: "angelo1234",
  database: 'angeloet_atsite'
  // user: "root",
  // password: "1234",
  // database: 'atsite'
});

const port = 3000;

function eventsNoticias(socket) {
  socket.on('saveNoticia', (data) => {
    socket.emit('noticiaResponse', {
      'descricao': 'Sucesso ao salvar nova notícia!',
      'error': false
    });
  });
  socket.on('deleteNoticia', (data) => {
    socket.emit('deleteNoticiaResponse', {
      'descricao': 'Sucesso ao deletar notícia!',
      'error': false
    });
  });
  socket.on('checkNoticias', (data) => {
    let noticias = [
      {
        id: 1,
        titulo: 'asd',
        data: new Date(),
        foto: 'http://www.depylaction.com.br/site/images/franquia-perfil-do-franqueado.jpg',
        descricao: 'qwqwe'
      },{
        id: 2,
        titulo: 'asd2',
        data: new Date(),
        foto: 'http://www.depylaction.com.br/site/images/franquia-perfil-do-franqueado.jpg',
        descricao: 'qwqwe2'
      }
    ];
    socket.emit('checkNoticiaResponse', {
      'descricao': JSON.stringify(noticias),
      'error': false
    });
  });
}

function eventsRedesocial(socket) {
  socket.on('checkRedesocial', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM info WHERE tipo = "y" OR tipo = "f" OR tipo = "s" OR tipo = "i" OR tipo = "t"';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('checkRedesocialResponse', {
          'descricao': result,
          'error': false
        });
      });
    });
  });
  socket.on('saveRedesocial', (data) => {
    con.connect(function(err) {
      for(var i = 0; i < data.length; i++){
        let sql = 'UPDATE info SET text = ? WHERE tipo = ?';
        con.query(sql, [data[i]['text'], data[i]['tipo']], function (err, result) {
          if (err) {
            socket.emit('redesocialResponse', {
              'descricao': 'Erro ao salvar redes sociais!',
              'error': true
            });
            return;
          }
          socket.emit('redesocialResponse', {
            'descricao': 'Sucesso ao salvar redes sociais!',
            'error': false
          });
        });
      }
    });
  });
}

function eventsCabecalho(socket) {
  socket.on('saveCabecalho', (data) => {
    con.connect(function(err) {
      let sql = 'UPDATE info SET text = ? WHERE tipo = "c"';
      con.query(sql, [data], function (err, result) {
        if (err) {
          socket.emit('cabecalhoResponse', {
            'descricao': 'Erro ao salvar cabeçalho!',
            'error': true
          });
          return;
        }
        socket.emit('cabecalhoResponse', {
          'descricao': 'Sucesso ao salvar cabeçalho!',
          'error': false
        });
      });
    });
  });
  socket.on('checkCabecalho', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM info WHERE tipo = "c"';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('checkCabecalhoResponse', {
          'descricao': result[0],
          'error': false
        });
      });
    });
  });
}

function eventsBiografia(socket) {
  socket.on('saveBiografia', (data) => {
    con.connect(function(err) {
      let sql = 'UPDATE info SET text = ? WHERE tipo = "b"';
      con.query(sql, [data], function (err, result) {
        if (err) {
          socket.emit('biografiaResponse', {
            'descricao': 'Erro ao salvar biografia!',
            'error': true
          });
          return;
        }
        socket.emit('biografiaResponse', {
          'descricao': 'Sucesso ao salvar biografia!',
          'error': false
        });
      });
    });
  });
  socket.on('checkBiografia', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM info WHERE tipo = "b"';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('checkBiografiaResponse', {
          'descricao': result[0],
          'error': false
        });
      });
    });
  });
}

function eventsAgenda(socket) {
  socket.on('checkAgenda', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM agenda WHERE id > 0';
      con.query(sql, function (err, result) {
        if(err) return;
        for(let i = 0; i < result.length; i++) {
          let thisDate = new Date(result[i].data);

          let day = thisDate.getDate();
          day = (day < 10) ? '0'+day : day;

          let month = thisDate.getMonth()+1;
          month = (month < 10) ? '0'+month : month;
          
          thisDate = thisDate.getFullYear()+'-'+month+'-'+day;
          
          result[i].data = thisDate;
          result[i].id = null;
        }
        socket.emit('checkAgendaResponse', {
          'descricao': result,
          'error': false
        });
      });
    });
  });
  socket.on('saveAgenda', (data) => {
    let agendas = data;
    let error = false;
    con.connect(function(err) {
      con.query('DELETE FROM agenda WHERE id > 0', function (err, result) {
        if(err){ error = true; } else { error = false; }
        con.commit();
        if(!error){
          for(let i = 0; i < agendas.length; i++) {
            let sql = 'INSERT INTO agenda (data, localizacao) VALUES ("'+agendas[i].data+'", "'+agendas[i].localizacao+'")';
            con.query(sql, function (err, result) {
              if(err){ error = true; } else { error = false; }
              con.commit();
            });
          }
        }
      });
    });
    if(error){
      socket.emit('agendaResponse', {
        'descricao': 'Erro ao salvar agenda!',
        'error': true
      });
    }else{
      socket.emit('agendaResponse', {
        'descricao': 'Sucesso ao salvar agenda!',
        'error': false
      });
    }
  });
}

function eventsTelefones(socket) {
  socket.on('checkTelefones', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM telefone WHERE id > 0';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('checkTelefonesResponse', {
          'descricao': result,
          'error': false
        });
      });
    });
  });
  socket.on('saveTelefones', (data) => {
    let telefones = data;
    let error = false;
    con.connect(function(err) {
      con.query('DELETE FROM telefone WHERE id > 0', function (err, result) {
        if(err){ error = true; } else { error = false; }
        con.commit();
        if(!error){
          for(let i = 0; i < telefones.length; i++) {
            let sql = 'INSERT INTO telefone (telefone) VALUES ("'+telefones[i].telefone+'")';
            con.query(sql, function (err, result) {
              if(err){ error = true; } else { error = false; }
              con.commit();
            });
          }
        }
      });
    });
    if(error){
      socket.emit('telefonesResponse', {
        'descricao': 'Erro ao salvar telefones!',
        'error': true
      });
    }else{
      socket.emit('telefonesResponse', {
        'descricao': 'Sucesso ao salvar telefones!',
        'error': false
      });
    }
  });
}

function eventsEmails(socket) {
  socket.on('checkEmails', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM email WHERE id > 0';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('checkEmailsResponse', {
          'descricao': result,
          'error': false
        });
      });
    });
  });
  socket.on('saveEmails', (data) => {
    let emails = data;
    let error = false;
    con.connect(function(err) {
      con.query('DELETE FROM email WHERE id > 0', function (err, result) {
        if(err){ error = true; } else { error = false; }
        con.commit();
        if(!error){
          for(let i = 0; i < emails.length; i++) {
            let sql = 'INSERT INTO email (email) VALUES ("'+emails[i].email+'")';
            con.query(sql, function (err, result) {
              if(err){ error = true; } else { error = false; }
              con.commit();
            });
          }
        }
      });
    });
    if(error){
      socket.emit('emailsResponse', {
        'descricao': 'Erro ao salvar e-mails!',
        'error': true
      });
    }else{
      socket.emit('emailsResponse', {
        'descricao': 'Sucesso ao salvar e-mails!',
        'error': false
      });
    }
  });
}

function eventsEndereco(socket) {
  socket.on('checkEndereco', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM endereco WHERE id > 0';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('checkEnderecoResponse', {
          'descricao': result[0],
          'error': false
        });
      });
    });
  });
  socket.on('saveEndereco', (data) => {
    let endereco = data;
    let error = false;
    con.connect(function(err) {
      con.query('DELETE FROM endereco WHERE id > 0', function (err, result) {
        if(err){ error = true; } else { error = false; }
        con.commit();
        if(!error){
          let sql = 'INSERT INTO endereco (endereco) VALUES ("'+endereco+'")';
          con.query(sql, function (err, result) {
            if(err){ error = true; } else { error = false; }
            con.commit();
          });
        }
      });
    });
    if(error){
      socket.emit('emailsResponse', {
        'descricao': 'Erro ao salvar endereço!',
        'error': true
      });
    }else{
      socket.emit('emailsResponse', {
        'descricao': 'Sucesso ao salvar endereço!',
        'error': false
      });
    }
  });
}

function eventsVideo(socket) {
  socket.on('checkVideos', (data) => {
    con.connect(function(err) {
      let sql = `SELECT m.id, m.video, m.ativo, v.id id_video, v.data, v.titulo, v.link FROM midia m
      LEFT JOIN video v ON v.id = m.video
      WHERE m.video IS NOT NULL`;
      con.query(sql, function(err, result) {
        if(!err){
          socket.emit('checkVideosResponse', {
            'descricao': result,
            'error': false
          });
        }
      });
    });
  });
  socket.on('deleteVideo', (data) => {
    con.connect(function(err) {
      let sql = 'DELETE FROM midia WHERE id = "'+data.midiaId+'"';
      con.query(sql, function(err, result) {
        if(err){
          socket.emit('videoResponse', {
            'descricao': 'Erro ao deletar vídeo!',
            'error': true
          });
          return;
        } else {
          let sql = 'DELETE FROM video WHERE id = "'+data.videoId+'"';
          con.query(sql, function(err, result) {
            if(err){
              socket.emit('videoResponse', {
                'descricao': 'Erro ao deletar vídeo!',
                'error': true
              });
              return;
            }
            socket.emit('videoResponse', {
              'descricao': 'Sucesso ao deletar vídeo!',
              'error': false
            });
          });
        }
      });
    });
  });
  socket.on('saveVideo', (data) => {
    con.connect(function(err) {
      let sql = 'INSERT INTO video (data, titulo, link) VALUES ("'+data.data+'", "'+data.titulo+'", "'+data.link+'")';
      con.query(sql, function (err, result) {
        if(err){
          socket.emit('videoResponse', {
            'descricao': 'Erro ao salvar vídeo!',
            'error': true
          });
          return;
        } else {
          let sql = 'INSERT INTO midia (video, ativo) VALUES ("'+result.insertId+'", "1")';
          con.query(sql, function (err, result) {
            if(err){
              socket.emit('videoResponse', {
                'descricao': 'Erro ao salvar vídeo!',
                'error': true
              });
              return;
            }
            socket.emit('videoResponse', {
              'descricao': 'Sucesso ao salvar vídeo!',
              'error': false
            });
          });
        }
      });
    });
  });
}

function eventsAlbum(socket) {
  socket.on('checkAlbum', (data) => {
    con.connect(function(err) {

      let sql = `SELECT a.local, a.data, f.id, u.caminho
      FROM album a
      INNER JOIN foto f ON f.album = a.id
      INNER JOIN upload u ON f.upload = u.id      
      WHERE f.album = "`+data.albumId+`"`;

      con.query(sql, function(err, result) {
        if(!err){
          socket.emit('checkAlbumResponse', {
            'descricao': result,
            'error': false
          });
        }else{
          console.log("ERROR", err);
        }
      });
    });
  });

  socket.on('deleteFoto', (data) => {
    con.connect(function(err) {
      let sql = `DELETE FROM foto WHERE id = "`+data.idFoto+`"`;
      con.query(sql, function(err, result) {
        if(!err){
          socket.emit('checkFotoResponse', {
            'descricao': "Sucesso ao deletar foto!",
            'error': false
          });
        }else{
          console.log("ERROR", err);
          socket.emit('checkFotoResponse', {
            'descricao': "Erro ao deletar foto!",
            'error': true
          });
        }
      });
    });
  });

  socket.on('editarAlbum', (data) => {
    con.connect(function(err) {
      let sql = `UPDATE album SET local = "`+data.albumLocal+`", data = "`+data.albumData+`" WHERE id = "`+data.idAlbum+`"`;
      con.query(sql, function(err, result) {
        if(!err){
          socket.emit('checkFotoResponse', {
            'descricao': "Sucesso ao editar álbum!",
            'error': false
          });
        }else{
          console.log("ERROR", err);
          socket.emit('checkFotoResponse', {
            'descricao': "Erro ao editar álbum!",
            'error': true
          });
        }
      });
    });
  });
}

function eventsAlbuns(socket) {
  socket.on('checkAlbuns', (data) => {
    con.connect(function(err) {
      let sql = `SELECT a.local, a.data, a.id id_album, m.id, (SELECT u.caminho FROM foto f INNER JOIN upload u ON f.upload = u.id WHERE f.album = a.id LIMIT 1) as primeira_foto FROM album a INNER JOIN midia m ON m.album = a.id`;
      con.query(sql, function(err, result) {
        if(!err){
          socket.emit('checkAlbunsResponse', {
            'descricao': result,
            'error': false
          });
        }else{
          console.log("ERROR", err);
        }
      });
    });
  });
  socket.on('deleteAlbum', (data) => {
    con.connect(function(err) {
      let sql = 'DELETE FROM midia WHERE id = "'+data.midiaId+'"';
      con.query(sql, function(err, result) {
        if(err){
          socket.emit('albunsResponse', {
            'descricao': 'Erro ao deletar álbum!',
            'error': true
          });
          return;
        }
        con.commit();
        let sql = 'DELETE FROM foto WHERE album = "'+data.albumId+'"';
        con.query(sql, function(err, result) {
          if(err){
            socket.emit('albunsResponse', {
              'descricao': 'Erro ao deletar álbum!',
              'error': true
            });
            return;
          }
          con.commit();
          let sql = 'DELETE FROM album WHERE id = "'+data.albumId+'"';
          con.query(sql, function(err, result) {
            if(err){
              socket.emit('albunsResponse', {
                'descricao': 'Erro ao deletar álbum!',
                'error': true
              });
              return;
            }
            con.commit();
            socket.emit('albunsResponse', {
              'descricao': 'Sucesso ao deletar álbum!',
              'error': false
            });
          });
        });
      });
    });
  });

  socket.on('saveAlbum', (data) => {
    con.connect(function(err) {
      let sql = 'INSERT INTO album (local, data) VALUES ("'+data.local+'", "'+data.data+'")';
      con.query(sql, function (err, result) {
        if(err){
          socket.emit('albunsResponse', {
            'descricao': 'Erro ao salvar álbum!',
            'error': true
          });
          return;
        } else {
          let sql = 'INSERT INTO midia (album, ativo) VALUES ("'+result.insertId+'", "1")';
          con.query(sql, function (err, result) {
            if(err){
              socket.emit('albunsResponse', {
                'descricao': 'Erro ao salvar álbum!',
                'error': true
              });
              return;
            }
            socket.emit('albunsResponse', {
              'descricao': 'Sucesso ao salvar álbum!',
              'error': false
            });
          });
        }
      });
    });
  });
}

function eventsLogin(socket) {
  socket.on('tryLogin', (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM usuario WHERE usuario = "'+data.usuario+'" AND senha = "'+data.senha+'"';
      con.query(sql, function (err, result) {
        if(err) {
          socket.emit('loginResponse', {
            'descricao': 'Erro ao logar!',
            'error': true
          });
          return;
        }
        socket.emit('loginResponse', {
          'descricao': 'Sucesso ao logar!',
          'error': false
        });
      });
    });
  });
}

function eventsMensagens(socket) {
  socket.on("enviaContato", (data) => {
    var nome = data.nome;
    var assunto = data.assunto;
    var email = data.email;
    var mensagem = data.mensagem;
    if((nome === '' || !nome) || (assunto === '' || !assunto) || (email === '' || !email) || (mensagem === '' || !mensagem)) {
      socket.emit('contatoResponse', {
        'descricao': 'Preencha todos os campos!',
        'error': true
      });
      return;
    }
    con.connect(function(err) {
      let sql = 'INSERT INTO contato (nome, assunto, email, mensagem, datahora) VALUES ("'+nome+'", "'+assunto+'", "'+email+'", "'+mensagem+'", NOW())';
      con.query(sql, function (err, result) {
        if(err) {
          socket.emit('contatoResponse', {
            'descricao': 'Erro ao mandar contato!',
            'error': true
          });
          return;
        }
        socket.broadcast.emit('waitingMensagemResponse');
        socket.emit('contatoResponse', {
          'descricao': 'Sucesso ao mandar contato!',
          'error': false
        });
      });
    });
  });
  socket.on("getCountMessagens", (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM contato';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('countMensagemResponse', {
          'descricao': result
        });
      });
    });
  });

  socket.on("getMessagens", (data) => {
    con.connect(function(err) {
      let sql = 'SELECT * FROM contato';
      con.query(sql, function (err, result) {
        if(err) return;
        socket.emit('mensagemResponse', {
          'descricao': result,
          'error': false
        });
      });
    });
  });

  socket.on('deleteMensagem', (data) => {
    con.connect(function(err) {
      let sql = 'DELETE FROM contato WHERE id = "'+data.id+'"';
      con.query(sql, function(err, result) {
        if(err){
          socket.emit('waitingMensagemResponse', {
            'descricao': 'Erro ao deletar mensagem!',
            'error': true
          });
          return;
        }
        // socket.broadcast.emit('waitingMensagemResponse');
        socket.emit('waitingMensagemResponse', {
          'descricao': 'Sucesso ao deletar mensagem!',
          'error': false
        });
      });
    });
  });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function eventsGaleria(socket) {
  socket.on('checkGaleria', (data) => {
    let sql = '';
    var arr = [[]];
    con.connect(function(err) {
      sql = `SELECT a.local text, a.data, a.id id_album, 'fotos', 
      (SELECT u.caminho FROM foto f LEFT JOIN upload u ON f.upload = u.id WHERE f.album = a.id LIMIT 1) as url
      FROM album a`;
      con.query(sql, function(err, result) {
        if(err) { console.log("ERROR", err); return; }
        for(let i = 0; i < result.length; i++) {
          if(result[i].url != null) {
            arr[0].push(result[i]);
          }
        }
        for(let j = 0; j < arr[0].length; j++) {
          sql = `SELECT u.caminho small, u.caminho medium, u.caminho big FROM foto f LEFT JOIN upload u ON f.upload = u.id WHERE f.album = `+arr[0][j]['id_album'];
          con.query(sql, function(err, result) {
            if(err) { console.log("ERROR", err); return; }
            arr[0][j].fotos = result;
          });
        }
        sql = `SELECT v.titulo text, v.data, v.id id_video, v.link url
        FROM video v`;
        con.query(sql, function(err, result) {
          if(err) { console.log("ERROR", err); return; }
          for(let i = 0; i < result.length; i++) {
            arr[0].push(result[i]);
          }
          arr[0] = shuffle(arr[0]);
          console.log('GALERIA', arr);
          socket.emit('checkGaleriaResponse', {
            'descricao': arr[0],
            'error': false
          });
        });
      });
    });
  });
}

io.on('connection', (socket) => {
  console.log('Novo cliente: ', socket.id);

  eventsMensagens(socket);
  eventsLogin(socket);
  eventsCabecalho(socket);
  eventsBiografia(socket);
  eventsGaleria(socket);
  eventsAgenda(socket);
  eventsTelefones(socket);
  eventsEmails(socket);
  eventsEndereco(socket);
  eventsNoticias(socket);
  eventsRedesocial(socket);
  eventsVideo(socket);
  eventsAlbuns(socket);
  eventsAlbum(socket);

  //create a cors middleware
  app.use(function(req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // app.use(express.static(__dirname + '/public'));
  app.use('/static', express.static(__dirname + '/public'));

  app.post("/upload/foto", function(req, res, next) {
    var path = '';
    upload(req, res, function (err) {
      if (err) {
        console.log('ERROR: ',err);
        return;
      }
      path = req.file.path;
      var start = path.substr(path.lastIndexOf('public') + 7);
      con.connect(function(err) {
        let sql = 'INSERT INTO upload (caminho) VALUES ("'+start+'")';
        con.query(sql, function(err, result) {
          if(err){
            socket.emit('checkFotoResponse', {
              'descricao': 'Erro ao inserir foto!',
              'error': true
            });
            socket.broadcast.emit('checkFotoResponse', {
              'descricao': 'Erro ao inserir foto!',
              'error': true
            });
            return;
          }
          let sql = 'INSERT INTO foto (album, upload) VALUES ("'+req.body.albumId+'", "'+result.insertId+'")';
          con.query(sql, function(err, result) {
            if(err){
              socket.emit('checkFotoResponse', {
                'descricao': 'Erro ao inserir foto!',
                'error': true
              });
              socket.broadcast.emit('checkFotoResponse', {
                'descricao': 'Erro ao inserir foto!',
                'error': true
              });
              return;
            }
            socket.emit('checkFotoResponse', {
              'descricao': 'Sucesso ao inserir foto!',
              'error': false
            });
            socket.broadcast.emit('checkFotoResponse', {
              'descricao': 'Sucesso ao inserir foto!',
              'error': false
            });
          });
        });
      });

    });
  });

  module.exports = app;

});

server.listen(port, () => {
  console.log("Listening on port " + port);
});