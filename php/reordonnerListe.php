<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"),true);
date_default_timezone_set('UTC+1');

//connexion à la db:
include 'connexiondb.php';


foreach ($data['listeProduits'] as $produit) {
  $sql = "UPDATE produits SET `ordre_produit`=".$produit['ordre_produit']." WHERE `id_produit`='".$produit['id_produit']."'";

  if(mysqli_query($conn,$sql)) { //envoie la requete
    echo "Mise à jour des données";
  } else {
    echo "Erreur dans la mise à jour des données: " . mysqli_error($conn);
  } 
}


mysqli_close($conn);

?>
