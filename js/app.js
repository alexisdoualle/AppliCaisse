app = angular.module('HLC',['angular.filter', 'chart.js', 'angular-sortable-view']);


app.controller('mainCtrl', function($scope, $http, $window, $filter) {

  $scope.historique = 'graph';

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
      $scope.data = [
        getTotalMois($scope.ventes, '2017-04')
      ];
    });
  }
  $scope.getVentes = getVentes();

  getDepenses = function() {
    $http.get("php/depenses.php")
    .then(function(response) {
      $scope.depenses = response.data.resultat;
    });
  }
  $scope.getDepenses = getDepenses();


  getProduit = function() {
    $http.get("php/produits.php")
    .then(function(response) {
      $scope.produits = response.data.resultat;
    });
  }
  $scope.getProduit = getProduit();


  getTypeDepense = function() {
    $http.get("php/typedepense.php")
    .then(function(response) {
      $scope.typeDepense = response.data.resultat;
    });
  }
  $scope.getTypeDepense = getTypeDepense();


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
      $window.location.reload();
    })
    .error(function (data, status, header, config) {
    });
  }

  updateDepenses = function(listeDepenses) {
    $http({
          method: "post",
          url: "php/insertDepenses.php",
          headers: {},
          data: {
            listeDepenses
          }
      })
    .success(function(data, status, headers, config) {
      console.log("requête envoyée");
      $window.location.reload();
    })
    .error(function (data, status, header, config) {
    });
  }

  //met "0" dans la case quand on clique dessus
  $scope.setQteToZero = function(produit) {
    $scope.produitsVendusJournee.push({"nom_produit":produit.nom_produit, "id_produit":produit.id_produit ,"qte_vente":0});
  }



  $scope.listeDepensesJournee = [];

  $scope.ajouterDepense = function(choix, montant) {
    var idTypeDepense = "";
    if (choix && montant) {
      for (var i = 0; i < $scope.typeDepense.length; i++) {
        if ($scope.typeDepense[i]["nom_typedepense"]==choix["nom_typedepense"]) {
          idTypeDepense = $scope.typeDepense[i]["id_typedepense"];
        }
      }
      $scope.listeDepensesJournee.push({"id_typedepense":idTypeDepense,"type_depense":choix.nom_typedepense, "montant_depense":montant});
    }
  }

  $scope.caFinalJournee = 0;
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
        //incrémente le ca total:
        $scope.caFinalJournee += prixProduitFloat;
        $scope.caFinalJournee = Math.round($scope.caFinalJournee*100)/100;
        return 0;
      }
    }
    //ajoute le produit dans la liste des ventes de la journée:
    $scope.produitsVendusJournee.push({"nom_produit":produit.nom_produit, "id_produit":produit.id_produit ,"qte_vente":1, "total_vente":prixProduitFloat});
    //incrémente le ca total:
    $scope.caFinalJournee += prixProduitFloat;
    $scope.caFinalJournee = Math.round($scope.caFinalJournee*100)/100;
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
            $scope.caFinalJournee -= prixProduitFloat;
            $scope.caFinalJournee = Math.round($scope.caFinalJournee*100)/100;
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

  //vérifie si une date est présente dans les dépenses
  verifierDateDepenses = function(d, listeDepenses) {
    for (var i = listeDepenses.length -1; i >= 0; i--) {
      if (listeDepenses[i].date_depense == d) {
        return true;
      }
    }
    return false;
  }


  $scope.creerVentesJournee = function() {
    //converti $scope.todayDateFormat en sql; Si il y'a un probleme avec le format de la date, quitte.
    if (dateSQL = convertirDateEnSQL($scope.todayDateFormat)) {}
    else {return 0;}
    //vérifie si la date est déjà utilisée, si oui, quitte
    if(verifierDateVentes(dateSQL, $scope.ventes)) {
      alert("Des ventes à cette date on déjà été enregistrées, modifiez la date");
      return 0;
    }
    //crée un compte rendu rapide des ventes de la journée, et ajoute la date:
    alrt = "date: " + dateSQL + "\n\n";
    //on parcours la boucle depuis la fin, puisqu'on risque d'enlever des éléments (et changer sa propriété length)
    for (var i = $scope.produitsVendusJournee.length-1; i >=0 ; i--) {
      //retire les ventes égales à 0 éventuelles:
      if ($scope.produitsVendusJournee[i]["qte_vente"]<=0) {
        $scope.produitsVendusJournee.splice(i,1);
        //passe à l'élément suivant de la boucle
        continue;
      }
      $scope.produitsVendusJournee[i]["date_vente"] = dateSQL;
      alrt += $scope.produitsVendusJournee[i]["qte_vente"] + " x ";
      alrt += $scope.produitsVendusJournee[i]["nom_produit"];
      alrt += "\n";
    }
    if ($scope.produitsVendusJournee.length==0) {
      alert("Il faut au moins une vente pour valider");
      return 0;
    }
    alrt += "\nChiffre d'affaire final = " + $scope.caFinalJournee.toString() +"€";
    alrt += "\nConfirmer?"
    valider = confirm(alrt);
    if (valider) {
      updateVentes($scope.produitsVendusJournee);
    } else {
      console.log("annulation la requête");
    }
  }

  $scope.creerDepensesJournee = function() {
    //converti $scope.todayDateFormat en sql; Si il y'a un probleme avec le format de la date, quitte.
    if (dateSQL = convertirDateEnSQL($scope.todayDateFormat)) {}
    else {return 0;}
    //vérifie si la date est déjà utilisée, si oui, quitte
    if(verifierDateDepenses(dateSQL, $scope.depenses)) {
      if (confirm("Des dépenses à cette date on déjà été enregistrées, êtes vous sûr de vouloir en ajouter?")) {
        //continue
      } else {
        return 0;
      }
    }
    //crée un compte rendu rapide des ventes de la journée, et ajoute la date:
    alrt = "date: " + dateSQL + "\n\n";
    for (var i = $scope.listeDepensesJournee.length-1; i >=0 ; i--) {
      $scope.listeDepensesJournee[i]["date_depense"] = dateSQL;
      alrt += $scope.listeDepensesJournee[i]["type_depense"];
      alrt += " : "
      alrt += $scope.listeDepensesJournee[i]["montant_depense"];
      alrt += "e"
      alrt += "\n";
    }
    if ($scope.listeDepensesJournee.length==0) {
      alert("Il faut au moins une dépense pour valider");
      return 0;
    }
    alrt += "\nConfirmer?"
    valider = confirm(alrt);
    if (valider) {
      updateDepenses($scope.listeDepensesJournee);
    } else {
      console.log("annulation la requête");
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

  //donne une position à un produit, le n°1 sera tout en haut et ainsi de suite
  $scope.reordonner = function(item, ordre) {
    $http({
          method: "post",
          url: "php/reordonner.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "nom_produit":item.nom_produit,
            "ordre_produit":ordre}
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

  $scope.changerDate = function(ancienneDate, nouvelleDate) {
    ancienneDate = convertirDateEnSQL(ancienneDate);
    nouvelleDate = convertirDateEnSQL(nouvelleDate);
    $http({
          method: "post",
          url: "php/changerdate.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "ancienneDate":ancienneDate,
            "nouvelleDate":nouvelleDate}
          })
    .success(function(data, status,headers,config){
      console.log("requête envoyée");
      $window.location.reload();
    });
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
  } //fin changerCouleur

  changementOrdre = function(listeProduits) {
    for (var i in listeProduits) {
      listeProduits[i].ordre_produit = i;
      //console.log($scope.produits[i].nom_produit +" "+ $scope.produits[i].ordre_produit);
    }
    $http({
          method: "post",
          url: "php/reordonnerListe.php",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            listeProduits}
          })
    .success(function(data, status,headers,config){
      console.log("requête envoyée");
      //$window.location.reload();
    });
  }

  $scope.testClick = function() {
    changementOrdre($scope.produits);
  }

  /* SECTION GRAPH */

  //fonction groupBy
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };


  $scope.moisPrecedentSuivant = function(mois,indice) {
    d = new Date(mois);
    d.setMonth(mois.getMonth()+indice);
    $scope.mois = d;
    mois = convertirDateEnSQL(d).substring(0,7);
    $scope.data = [
      getTotalMois($scope.ventes, mois)
    ];
  }



  var getTotalMois = function(listeVentes, mois) {
    var listeMois = [];
    var totalMois = new Array(31).fill(0);
    //on prends toutes les ventes du mois donnés:
    for (i of listeVentes) {
      if (i.date_vente.substring(0,7) == mois) {
        listeMois.push(i);
      }
    }
    //on regroupe les ventes par date:
    listeMois = groupBy(listeMois, 'date_vente');
    for (var dt in listeMois) {
      var totalJour = $scope.getTotal(listeMois[dt]);
      totalMois[dt.substring(8,10)-1] = totalJour;
    }
    return totalMois;
  }

  $scope.labels = [];
  for (var i = 1; i <= 31; i++) {
    $scope.labels.push(("0"+i).slice(-2));
  }

  $scope.series = ['Ventes', 'Dépenses'];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };


});
app.filter('reverse', function() {
  return function(items) {
    if (!items || !items.length) { return; }
    return items.slice().reverse();
  };
});
