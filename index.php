<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-filter/dist/angular-filter.min.js"></script>
    <script src="node_modules/chart.js/dist/Chart.min.js"></script>
    <script src="node_modules/angular-chart.js/dist/angular-chart.min.js"></script>
    <script src="node_modules/angular-sortable-view/src/angular-sortable-view.min.js"></script>
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
          <input type="date" ng-model="todayDateFormat" class="dateclass">
        </div>
        <table sv-root sv-part="produits">
          <tr>
            <th>Nom</th>
            <th></th>
            <th>Qté</th>
            <th>Prix</th>
            <th>TVA</th>
            <th></th>
          </tr>
          <tr ng-repeat="produit in produits" sv-element>
            <td ng-attr-title="rang: {{produit.ordre_produit}}" ng-style="{'background-color':(produit.couleur_produit)}" ng-click="changerCouleur(produit)">{{produit.nom_produit}}</td>
            <td style="item-align:center; min-width:100px">
              <input type="button" ng-click="incrementerProduit(produit)" value="Ajouter" class="bouttonVendre">
              <input type="boutton" ng-click="decrementerProduit(produit)" value="-" class="bouttonAnnuler">
            </td>
            <td style="item-align:center; max-width:40px">
              {{(produitsVendusJournee | filter:{'nom_produit':produit.nom_produit} : true)[0].qte_vente}}
            </td>
            <td style="min-width:60px">{{produit.prix_produit}} €</td>
            <td>{{produit.tva_produit}}%</td>
            <td sv-handle style="min-width:30px"><span class="dragButton">&#8597</span></td>
          </tr>
          <tr>
            <td style="width:250px">Chiffre d'affaire: <b>{{caFinalJournee}}€</b></td>
            <td><input type="button" value="Mise à 0" ng-click="miseAZero()"></td>
          </tr>
          <tr>
            <td><input type="button" class="bouttonVendre" value="Valider Journée" ng-click="creerVentesJournee()"></td>
            <td><input type="button" value="Sauvegarder ordre produits" ng-click="reordonnerTout()"></td>
          </tr>
        </table>
      <h2>Dépenses</h2>
      <div class="datePicker">
        Entrez la date:
        <input type="date" ng-model="todayDateFormat" class="dateclass">
      </div>
        <table>
          <tr>
            <th>Type</th>
            <th style="width:500px">Montant</th>
          </tr>
          <tr>
            <td><select ng-model="choixTypeDepense" ng-options="dep.nom_typedepense for dep in typeDepense"></select></td>
            <td><input type="number" ng-model="montantDepense"><input type="button" value="ajouter" ng-click="ajouterDepense(choixTypeDepense, montantDepense)"></td>
          </tr>
          <tr ng-repeat="(key, value) in listeDepensesJournee | groupBy: 'type_depense'">
            <td> {{key}}:</td>
            <td><span ng-repeat="v in value">{{v.montant_depense}}€,</span>
            </td>
          </tr>
          <tr>
            <td><input type="button" class="bouttonVendre" value="Valider Dépenses" ng-click="creerDepensesJournee()"></td>
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
          <tr>
            <td>
              Réordonner:
              <select ng-model="produitOrdre" ng-options="item.nom_produit for item in produits">
              </select>
              <input type="number" ng-model="nouvelOrdre" placeholder="nouvelle position">
              <input type="button" value="Valider" ng-click="reordonner(produitOrdre, nouvelOrdre)" class="btn">
            </td>
          </tr>
          <tr>
            <td>
              <span>Modifier une date</span>
              <ul>
                <li>Ancienne date: <input type="date" ng-model="ancienneDate"></li>
                <li>Nouvelle date: <input type="date" ng-model="nouvelleDate"></li>
              </ul>
              <input type="button" ng-click="changerDate(ancienneDate, nouvelleDate)" value="valider">
            </td>
          </tr>
        </table>
      <h2>Historique</h2>
        <table>
          <tr>
            <td>Ventes <input type="radio" ng-model="historique" value="ventes"></td>
            <td>Dépenses <input type="radio" ng-model="historique" value="depenses"></td>
            <td>Graph <input type="radio" ng-model="historique" value="graph"></td>
          </tr>
          <tr  ng-show="historique == 'ventes'" ng-repeat="(key, value) in ventes | reverse | groupBy: 'date_vente'  ">
            <td colspan="7"> {{key}} :
              <ul>
                <li ng-repeat="v in value">{{v.nom_produit}} : {{v.qte_vente}} ({{v.total_vente}} €)</li>
              </ul>
              <span style="font-size:20px; float:right">total = {{getTotal(value)}} €</span>
            </td>
          </tr>
          <tr ng-show="historique == 'depenses'" ng-repeat="(key, value) in depenses | groupBy: 'date_depense'">
            <td colspan="7">
              {{key}}
              <ul>
                <li ng-repeat="v in value">{{v.nom_typedepense}}, {{v.montant_depense}}€</li>
              </ul>
            </td>
          </tr>
        </table>
        <!-- <input type="button" name="" value="test" ng-click="testClick()"> -->
        <div style="width:30%; margin:auto">
          <input type="button" value="<" ng-click="moisPrecedentSuivant(mois,-1)">
          <input type="month" ng-model="mois"></select>
          <input type="button" value=">" ng-click="moisPrecedentSuivant(mois,1)">
        </div>
        <div>
          <canvas id="line" class="chart chart-line" chart-data="data"
            chart-labels="labels" chart-series="series" chart-options="options"
            chart-dataset-override="datasetOverride" chart-click="onClick">
          </canvas>
        </div>
    </div><!-- fin div corps -->
  </body>
</html>
