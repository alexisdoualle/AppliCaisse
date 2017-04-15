<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"),true);
date_default_timezone_set('UTC+1');

//connexion à la db:
include 'connexiondb.php';

//vérifie si il existe des ventes à la date donnée
$sql2 = "SELECT * FROM `depenses` WHERE `date_depense`= '".$data['listeDepenses'][0][date_vente]. "'";
$result = $conn->query($sql2);
if ($rs = $result->fetch_array(MYSQLI_ASSOC)) {
  echo "il existe deja des dépenses à cette date, aucune mise à jour effectuée" ;
} else {
  //obtient l'élement 'listeJournee' de $data, qui est la liste des ventes de la journée
  foreach ($data['listeDepenses'] as $depense) {
    $sql = "INSERT INTO `depenses`( `type_depense`, `date_depense`, `montant_depense`) VALUES (" . $depense['id_typedepense'] . ",'" . $depense['date_depense'] . "',".$depense['montant_depense']." )";
    if(mysqli_query($conn,$sql)) { //envoie la requete
      echo "Mise à jour des données";
    } else {
      echo "Erreur dans la mise à jour des données: " . mysqli_error($conn);
    }
  }

}



mysqli_close($conn);

?>
