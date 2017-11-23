// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('PetApp', ['ionic','firebase','ngCordova']);

//'ionic.native'

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
app.config(function($stateProvider, $urlRouterProvider) {

  

  //Tela "Login"
$stateProvider.state('login',{
  url: '/login',
  templateUrl: 'templates/login.html',
  controller: 'LoginCtrl'
});

//Tela "Cadastro"

$stateProvider.state('cadastro',{
  url:'/cadastro',
  templateUrl:'templates/cadastro.html',
  controller: 'CadastroCtrl'
});

//Tela "Cadastro Pet"

$stateProvider.state('cadastro_pet',{
  url:'/cadastro_pet',
  templateUrl:'templates/cadastro_pet.html',
  controller: 'CadastroPetCtrl'
});

//TELA "ESQUECI A SENHA"
$stateProvider.state('esqueci_senha',{
  url:'/esqueci_senha',
  templateUrl:'templates/esqueci_senha.html',
  controller: 'Esqueci_senhaCtrl'
});


//TELA "PRINCIPAL"
$stateProvider.state('principal',{
  url:'/principal',
  templateUrl:'templates/principal.html',
  controller: 'PrincipalCtrl'
});

//TELA "SERVICOS"
$stateProvider.state('servicos',{
  url:'/servicos',
  templateUrl:'templates/servicos.html',
  controller: 'ServicosCtrl'
});
  //TELA "Banho_tosa"
$stateProvider.state('banhotosa',{
  url:'/banhotosa',
  templateUrl:'templates/banhotosa.html',
  controller: 'BanhoTosaCtrl'
});

 //TELA "Meu pet"
$stateProvider.state('meupet',{
  url:'/meupet',
  templateUrl:'templates/meupet.html',
  controller: 'MeuPetCtrl'
});

//TELA "Baner"
$stateProvider.state('baner',{
  url:'/baner/:id',
  templateUrl:'templates/baner.html',
  controller: 'BanerCtrl'
});

//TELA "Chat"
$stateProvider.state('chat',{
  url:'/chat/:id',
  templateUrl:'templates/chat.html',
  controller: 'ChatCtrl'
});



//Tela "Editar"

// $stateProvider.state('editar',{
//   url:'/editar',
//   templateUrl:'templates/editar.html',
//   controller: 'EditarCtrl'
// });

// indica a tela inical (inicial state)

$urlRouterProvider.otherwise('/login'); 




  
});


app.controller('ChatCtrl', function($state, $scope, $firebaseArray, $stateParams){

var user = firebase.auth().currentUser;
 var id = $stateParams.id;

  var ref = firebase.database().ref().child('mensagem');
  var users = user.uid + "_" + id;
  var query = ref.orderByChild("users").equalTo(users);//startAt(user.uid).endAt(id);
  debugger;
  $scope.mensagens = $firebaseArray(query);

 $scope.apagar = function(id) {
         var obj = $scope.meupet.$getRecord(id);       
         $scope.meupet.$remove(obj);
    }

    $scope.enviar = function(msg){
    msg.users = user.uid + "_" + id;
    var ref = firebase.database().ref().child('mensagem');
    $firebaseArray(ref).$add(msg);
    }

// var ref = firebase.database().ref().child('mensagem');
//  $scope.mensagem = $firebaseArray(ref);


 
});

app.controller('CadastroCtrl', function($state, $scope, $firebaseAuth){
 
    $scope.cadastrar = function(user){

      $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password)
      .then(function(firebaseUser){
        //efetuou o registro com sucesso.
        $state.go('login');

      })
      .catch(function(error){
        //ocorreu um erro no login.
        alert(error.message);

      })
    }


  // $scope.usuarios = {}; //Contato contato = new Contato();  

  // $scope.salvar = function(banho_tosa){
  //   var ref = firebase.database().ref().child('usuarios');
  //   $firebaseArray(ref).$add(banho_tosa);

  //   $state.go('login');

  // }
   
});

app.controller('CadastroPetCtrl', function($state, $scope, $firebaseArray, $cordovaCamera){

  var user = firebase.auth().currentUser;
 
  $scope.cadpet = {}; //Contato contato = new Contato();  

  $scope.salvarpet = function(pet){
    pet.dono = user.uid;
    var ref = firebase.database().ref().child('cadpet');
    $firebaseArray(ref).$add(pet);

    $state.go('principal');

  }

  $scope.tirarFoto = function() {
    var options = {
      quality: 50,
      destinationType: 0,
      sourceType: 1,
      encodingType: 1
    }
    $cordovaCamera.getPicture(options).then(function(imageData)  {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        var base64Image = 'data:image/jpeg;base64,' + imageData;
        $scope.url = base64Image;
      }).catch(function(error) {
      // Handle error
      alert(error);
      });
  }
   
});

app.controller('LoginCtrl', function($state, $scope, $firebaseAuth, $firebaseObject){

    $firebaseAuth().$onAuthStateChanged(function(firebaseUser){

      if(firebaseUser){
        $state.go('principal');
        var idUsuario = firebaseUser.uid;
      }

      var ref = firebase.database().ref().child('capa');
 $scope.imglogin = $firebaseObject(ref);


    })

    $scope.entrar = function(user){

      $firebaseAuth().$signInWithEmailAndPassword(user.email, user.password)
      .then(function(firebaseUser){
        //efetuou o login com sucesso.
        $state.go('login');

      })
      .catch(function(error){
        //ocorreu um erro no login.
        alert(error.message);

      })
    }

   
});

app.controller('Esqueci_senhaCtrl', function(){

  
});


app.controller('BanerCtrl', function($scope, $state, $firebaseObject, $stateParams, $firebaseArray){

  var id = $stateParams.id;

  var ref = firebase.database().ref().child('banho_tosa').child(id);
  $scope.baner = $firebaseObject(ref);

  

  function atualizaCurtidas() {

    var refCurtidas = firebase.database().ref("curtidas").child(id);
    $firebaseArray(refCurtidas).$loaded(function(curtidas) {
        $scope._curtidas = 0;
        $scope._naocurtidas = 0;

        for(var i = 0; i < curtidas.length; i++) {
          // console.log(curtidas[i].$value);
          if(curtidas[i].$value == true) {
            $scope._curtidas++;
          }
        }

        $scope._naocurtidas =  curtidas.length -  $scope._curtidas;
    })
  }

  atualizaCurtidas();
  
  

  $scope.chat = function() {
    $state.go('chat', {id: id});
     }

      $scope.salvar = function(clas){
      var ref = firebase.database().ref().child('class');
    $firebaseArray(ref).$add(clas);

    $state.go('principal');

  }

    $scope.gostei = function() {
     
      var user = firebase.auth().currentUser;
      var ref = firebase.database().ref("curtidas").child(id).child(user.uid).set(true).then(function() {
        atualizaCurtidas();
      })
      

    }

    $scope.naogostei = function() {

      var user = firebase.auth().currentUser;
      var ref = firebase.database().ref("curtidas").child(id).child(user.uid).set(false).then(function() {
        atualizaCurtidas();
      })
  }
  
});



app.controller('PrincipalCtrl', function($scope, $state, $ionicSideMenuDelegate){

  $scope.servicos = function() {
    $state.go('servicos');
     }

$scope.cadpet = function() {
    $state.go('cadastro_pet');
     }
  $scope.meupet = function() {
    $state.go('meupet');
     }


});

app.controller('ServicosCtrl', function($scope, $state, $ionicSideMenuDelegate){

$scope.banhotosa = function() {
    $state.go('banhotosa');
     }
  
});



app.controller('BanhoTosaCtrl', function($scope, $firebaseArray, $state){

var ref = firebase.database().ref().child('banho_tosa');
 $scope.contatos = $firebaseArray(ref);


 $scope.agenda = function(id) {
          $state.go('baner',{id:id});
    }
     
   
  
});

app.controller('MeuPetCtrl', function($scope, $firebaseArray, $state, $firebaseAuth){

 var user = firebase.auth().currentUser;

  var ref = firebase.database().ref().child('cadpet');
  var query = ref.orderByChild("dono").equalTo(user.uid);
  $scope.meupet = $firebaseArray(query);

 $scope.apagar = function(id) {
         var obj = $scope.meupet.$getRecord(id);       
         $scope.meupet.$remove(obj);
    }
  
});
app.controller('AdestramentoCtrl', function($scope, $ionicSideMenuDelegate){


  
});

app.controller('VeterinarioCtrl', function($scope, $ionicSideMenuDelegate){


  
});
app.controller('HotelCtrl', function($scope, $ionicSideMenuDelegate){


  
});

app.controller('Banho_TosaCtrl', function($scope, $ionicSideMenuDelegate){


  
});

app.controller('TesteCtrl', function($scope, $ionicSideMenuDelegate){


  
});

// app.factory('ContatoService', function(){

//   var lista = []; //database (vetor) (volátil)

//   return {

//     read: function(){
//       return lista;
//     },

//     create: function(objeto ) {
//       lista.push(objeto,);

     
//     }
//   }

  

// });