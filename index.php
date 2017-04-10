<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-filter/dist/angular-filter.min.js"></script>
    <script src="js/app.js"></script>
    <title>Caisse</title>
  </head>
  <!-- ng-app initialise l'application angularjs, telle que définie dans app.js-->
  <body ng-app="HLC">
    <!-- Le controleur 'mainCtrl' manipule l'application.
        Il contient les variables et méthodes qui seront utilisées, ainsi que les données
    -->
    <div ng-controller="mainCtrl">
      <h2>Ventes</h2>
        <div class="datePicker">
          Entrez la date:
          <input type="date" ng-model="todayDateFormat">
        </div>
        <table>
          <tr>
            <th>Nom</th>
            <th></th>
            <th>Qté</th>
            <th>Prix</th>
            <th>TVA</th>
          </tr>
          <tr ng-repeat="produit in produits">
            <td ng-style="{'background-color':(produit.couleur_produit)}" ng-click="changerCouleur(produit)">{{produit.nom_produit}}</td>
            <td style="item-align:center; min-width:100px">
              <input type="button" ng-click="incrementerProduit(produit)" value="Ajouter" class="bouttonVendre">
              <input type="boutton" ng-click="decrementerProduit(produit)" value="-" class="bouttonAnnuler">
            </td>
            <td>
              <input type="number"
                      class="quantite"
                      ng-model="(produitsVendusJournee | filter:{'nom_produit':produit.nom_produit} : true)[0].qte_vente"
                      ng-click="setQteToZero(produit)">
            </td>
            <td>{{produit.prix_produit}} €</td>
            <td>{{produit.tva_produit}}%</td>
          </tr>
          <tr>
            <td><input type="button" class="bouttonVendre" value="Valider Journée" ng-click="creerVentesJournee()"></td>
          </tr>
        </table>
      <h2>Dépenses</h2>
        <table>
          <tr>
            <th>Type</th>
            <th>Montant</th>
          </tr>
          <tr>
            <td><select ng-model="choixTypeDepense" ng-options="dep.nom_typedepense for dep in typeDepense"></select></td>
            <td><input type="number" ng-model="montantDepense"><input type="button" value="test" ng-click="testClick(choixTypeDepense, montantDepense)"></td>
          </tr>
          <tr ng-repeat="(key, value) in listeDepensesJournee | groupBy: 'type'">
            <td> {{key}}:</td>
            <td><span ng-repeat="v in value">({{v.montantDepense}})</span>
            </td>
          </tr>
        </table>
      <h2>Exporter</h2>
        <table>
          <tr>
            <th>Période</th>
          </tr>
          <tr>
            <td>
              <input type="month" ng-model="mois"></select>
              <input type="button" value="Télécharger" ng-click="exporterMois(mois)">
            </td>
          </tr>
        </table>
      <h2>Options</h2>
        <table>
          <tr>
            <th>Options</th>
          </tr>
          <tr>
            <td>
              <span>Modifier un produit</span>
              <select ng-model="produitAModifier" ng-options="item.nom_produit for item in produits"></select>
              <input type="text" placeholder="nouveau nom" ng-model="nouveauNom">
              <input type="number" placeholder="prix" ng-model="nouveauPrix">
              <input type="number" placeholder="tva" ng-model="nouvelleTva">
              <input type="button" value="Valider" ng-click="modifierProduit(produitAModifier,nouveauNom,nouveauPrix, nouvelleTva)">
            </td>
          </tr>
          <tr>
            <td>
              <span>Ajouter un produit</span>
              <input type="text" placeholder="nom" ng-model="nom">
              <input type="number" placeholder="prix" ng-model="prix">
              <input type="button" value="Valider" ng-click="ajouterProduit(nom,prix)">
            </td>
          </tr>
          <tr>
            <td>
              <span>Supprimer un produit</span>
              <select ng-model="produitASupprimer" ng-options="item.nom_produit for item in produits"></select>
              <input type="button" value="Valider" ng-click="supprimerProduit(produitASupprimer)">
            </td>
          </tr>
        </table>
      <h2>Historique</h2>
        <table>
          <tr>
            <th>Produit</th>
            <th>Date</th>
            <th>Quantité</th>
          </tr>
          <tr ng-repeat-start="(key, value) in ventes | reverse | groupBy: 'date_vente'  ">
            <td colspan="7"> {{key}} :
              <ul>
                <li ng-repeat="v in value">{{v.nom_produit}} : {{v.qte_vente}} ({{v.total_vente}} €)</li>
              </ul>
              <span style="font-size:20px; float:right">total = {{getTotal(value)}} €</span>
            </td>
            <tr ng-repeat-end><td></td></tr>
          </tr>
        </table>
    </div><!-- fin div corps -->
  </body>
</html>
