var socket = io.connect("http://cahonline.herokuapp.com/")
var app = angular.module('CAHOnline',['ngRoute']);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "home.html",
    controller: "mainCtrl"
  })
  .when("/:room", {
    templateUrl: "game.html",
    controller: "joinGame"
  })

  $locationProvider.html5Mode(true);
})

app.controller("joinGame", function ($scope, $routeParams){
  $scope.room=$routeParams.room
  $scope.id=socket.io.engine.id

  socket.on('display_players', function(data){
    $scope.players=data.players
    $scope.$apply()
  })

  socket.emit('fetch_players',{room: $routeParams.room})

})

app.controller('mainCtrl', function($scope, $location) {
  //if user clicked to go back to home we should remove him from the players, until he joins another room
  socket.emit("delete_player")

  $scope.createRoom = function() {
    if ($scope.playerName && $scope.playerName.length > 2) {
      socket.emit("create_room", {name: $scope.playerName})
    } else {
      alert("Name is too short or void")
    }
  }

  $scope.joinRoom = function() {
    if ($scope.roomId && ($scope.playerName ? $scope.playerName.length > 2 : false)) {
      socket.emit("join_room", { 
        name: $scope.playerName,
        roomId: $scope.roomId })
    } else {
      alert("Inserisci un id della stanza")
    }
  }

  socket.on('load_game_page', function(data){
    $location.path("/"+data.room)
    $scope.$apply()
  })
})