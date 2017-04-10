app = angular.module('HLC',['angular.filter']);


app.controller('mainCtrl', function($scope, $http, $window) {

  // obtient la date et la met au bon format AAAA-MM-JJ dans $scope.today et $scope.thisMonth (pour le montant des ventes par période):
  $scope.todayDateFormat = new Date();

  convertirDateEnSQL = function(d) {
    try {
      var month = d.getUTCMonth() + 1; //mois de 1 à 12
      var day = d.getDate();
      var year = d.getUTCFullYear();
      dateSqlFormat = year + "-" + (month < 10 ? '0' + month : '' + month) + "-" + (day < 10 ? '0' + day : '' + day);
      thisMonth = year + "-" + (month < 10 ? '0' + month : '' + month);
      return dateSqlFormat;
    } catch (e) {
      if (e instanceof TypeError) {
        alert("Il y a un problème avec la date");
        return false;
      }
    }
  }

  getVentes = function() {
    $http.get("php/ventes.php")
    .then(function(response) {
      $scope.ventes = response.data.resultat;
    });
  }
  $scope.getVentes = getVentes();


  getProduit = function() {
    $http.get("php/produits.php")
    .then(function(response) {
      $scope.produits = response.data.resultat;
    });
  }
  $scope.getProduit = getProduit();

  getCA = function() {
    $http.get("php/ca.php")
    .then(function(response) {
      $scope.ca = response.data.resultat;
    });
  }
  $scope.getCA = getCA();


  getTypeDepense = function() {
    $http.get("php/typedepense.php")
    .then(function(response) {
      $scope.typeDepense = response.data.resultat;
    });
  }
  $scope.getTypeDepense = getTypeDepense();

 $scope.listeDepensesJournee = [];

 $scope.testClick = function(choix, montant) {
   $scope.listeDepensesJournee.push({"type":choix.nom_typedepense, "montantDepense":montant});
   console.log($scope.ventes);
 }

  updateVentes = function(listeJournee) {
    $http({
          method: "post",
          url: "php/insertVentes.php",
          headers: {},
          data: {
            listeJournee
          }
      })
    .success(function(data, status, headers, config) {
      console.log("requête envoyée");
            location.reload();
    })
    .error(function (data, status, header, config) {
    });
  }

  //met "0" dans la case quand on clique dessus
  $scope.setQteToZero = function(produit) {
    $scope.produitsVendusJournee.push({"nom_produit":produit.nom_produit, "id_produit":produit.id_produit ,"qte_vente":0});
  }

  //fonction pour incrementer les produits
  $scope.produitsVendusJournee = [];
  $scope.incrementerProduit = function(produit) {
    var prixProduitFloat = parseFloat(produit.prix_produit);
    //vérifie si le produit est déjà dans les ventes de la journée
    for (var i = 0; i < $scope.produitsVendusJournee.length; i++) {
      //si oui, incrémente la quantite et quitte avec return 0
      if ($scope.produitsVendusJournee[i].nom_produit == produit.nom_produit) {
        $scope.produitsVendusJournee[i].qte_vente += 1;
        $scope.produitsVendusJournee[i].total_vente += prixProduitFloat;
        return 0;
      }
    }
    //ajoute le produit dans la liste des ventes de la journée:
    $scope.produitsVendusJournee.push({"nom_produit":produit.nom_produit, "id_produit":produit.id_produit ,"qte_vente":1, "total_vente":prixProduitFloat});
  }

    //fonction pour decrémenter les produits
    $scope.decrementerProduit = function(produit) {
      var prixProduitFloat = parseFloat(produit.prix_produit);
      //vérifie si le produit est déjà dans les ventes de la journée
      for (var i = 0; i < $scope.produitsVendusJournee.length; i++) {
        if ($scope.produitsVendusJournee[i].nom_produit == produit.nom_produit) {
          //si la quantite est positive, decrémente la quantite et quitte avec return 0
          if ($scope.produitsVendusJournee[i].qte_vente > 0) {
            $scope.produitsVendusJournee[i].qte_vente -= 1;
            $scope.produitsVendusJournee[i].total_vente -= prixProduitFloat;
            return 0;
          }
        }
      }
    }

  //vérifie si une date est présente dans les ventes
  verifierDateVentes = function(d, listeVentes) {
    for (var i = listeVentes.length -1; i >= 0; i--) {

      if (listeVentes[i].date_vente == d) {
        return true;
      }
    }
    return false;
  }


  $scope.creerVentesJournee = function() {
    if (dateSQL = convertirDateEnSQL($scope.todayDateFormat)) {}
    else {return 0;}
    //vérifie si la date est déjà utilisée, si oui, quitte
    if(verifierDateVentes(dateSQL, $scope.ventes)) {
      alert("Des ventes à cette date on déjà été enregistrées, modifiez la date");
      return 0;
    }
    //crée un compte rendu rapide des ventes de la journée, et ajoute la date:
    alrt = "date: " + dateSQL + "\n\n";
    for (var i = 0; i < $scope.produitsVendusJournee.length; i++) {
      //retire les ventes égales à 0 éventuelles:
      if ($scope.produitsVendusJournee[i]["qte_vente"]<=0) {
        $scope.produitsVendusJournee.splice(i,1);
      }
      $scope.produitsVendusJournee[i]["date_vente"] = dateSQL;
      alrt += $scope.produitsVendusJournee[i]["qte_vente"] + " x ";
      alrt += $scope.produitsVendusJournee[i]["nom_produit"];
      alrt += "\n";
    }
    alrt += "\nConfirmer?"
    valider = confirm(alrt);
    if (valider) {
      updateVentes($scope.produitsVendusJournee);

    } else {
      console.log("test = false");
    }
  }

  $scope.getTotal = function(listeVentes) {
    var somme = 0;
    for (i of listeVentes) {
      somme += i.total_vente;
    }
    somme = Math.round(somme*100)/100;
    return somme;
  }

  $scope.modifierProduit = function(item, nouveauNom=item.nom_produit, nouveauPrix=item.prix_produit, nouvelleTva=item.tva_produit) {
    if (nouveauNom=="") {
      alert("Il faut reécrire le nom")
      return 0;
    }
    $http({
          method: "post",
          url: "php/modifier.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "produit":item.nom_produit,
            "nouveauNom":nouveauNom,
            "nouveauPrix":nouveauPrix,
            "nouvelleTva":nouvelleTva}
          })
    .success(function(data, status,headers,config){
      console.log("requête envoyée");
      $window.location.reload();
    });
  }
  //Ajoute un produit
  $scope.ajouterProduit = function(nouveauProduit, prix=1) {
    $http({
          method: "post",
          url: "php/ajouterProduit.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "nouveauProduit":nouveauProduit,
            "prix":prix}
          })
    .success(function(data, status,headers,config){
      console.log("requête envoyée");
      $window.location.reload();
    });
  }

  $scope.mois=$scope.todayDateFormat;
  $scope.exporterMois = function(mois) {
    $scope.listeVentesMois = [];
    moisISO = convertirDateEnSQL(mois);
    moisISO = moisISO.substring(0,7);
    for (var i = 0; i < $scope.ventes.length; i++) {
      if ($scope.ventes[i].date_vente.substring(0,7) == moisISO) {
        $scope.listeVentesMois.push($scope.ventes[i]);
      }
    }
    creerCSV(moisISO);
  }
  creerCSV = function(mois) {
    $http({
          method: "post",
          url: "php/exporter.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "mois":mois}
          })
    .success(function(data, status, headers, config) {
         var anchor = angular.element('<a/>');
         anchor.css({display: 'none'}); // Pour Firefox
         angular.element(document.body).append(anchor); // Pour Firefox
         anchor.attr({
             href: 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data),
             target: '_blank',
             download: 'ventes'+ mois +'.csv'
         })[0].click();
         anchor.remove(); // Pour Firefox
      }).
      error(function(data, status, headers, config) {
        // handle error
      });
  }


  //Ne supprime pas le produit de la base de donnée, mais le rends inactif.
  $scope.supprimerProduit = function(item) {
    if (confirm("Etes-vous sûr de vouloir supprimer: " + item.nom_produit + "?")) {
      $http({
            method: "post",
            url: "php/supprimerProduit.php",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
              "produit":item.nom_produit}
            })
      .success(function(data, status,headers,config){
        console.log("requête envoyée");
        $window.location.reload();
      });
    }
  }

  $scope.changerCouleur = function(item) {
    var c1 = "DarkTurquoise";
    var c2 = "DarkSalmon";
    var c3 = "Gold";
    var c4 = "LightGreen";
    var c5 = "LightBlue";
    var c6 = "Tomato";
    var c7 = "LightYellow";
    var c8 = "LightPink";
    var c9 = "SandyBrown";
    switch (item.couleur_produit) {
      case c1:
        item.couleur_produit = c2;
        break;
      case c2:
        item.couleur_produit = c3;
        break;
      case c3:
        item.couleur_produit = c4;
        break;
      case c4:
        item.couleur_produit = c5;
        break;
      case c5:
        item.couleur_produit = c6;
        break;
      case c6:
        item.couleur_produit = c7;
        break;
      case c7:
        item.couleur_produit = c8;
        break;
      case c8:
        item.couleur_produit = c9;
        break;
      case c9:
        item.couleur_produit = c1;
        break;
    }
    $http({
          method: "post",
          url: "php/changerCouleur.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "produit":item.nom_produit,
            "nouvelleCouleur":item.couleur_produit}
          })
    .success(function(data, status,headers,config){
      console.log("requête envoyée");
    });
  }


});
app.filter('reverse', function() {
  return function(items) {
    if (!items || !items.length) { return; }
    return items.slice().reverse();
  };
});
