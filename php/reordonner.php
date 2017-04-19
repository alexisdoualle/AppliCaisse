<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"));

//connexion à la db:
include 'connexiondb.php';

$nom_produit = mysqli_real_escape_string($conn,$data->nom_produit);
$ordre_produit = mysqli_real_escape_string($conn,$data->ordre_produit);


$sql = "UPDATE produits SET `ordre_produit`=".$ordre_produit." WHERE `nom_produit`='".$nom_produit."'";

if(mysqli_query($conn,$sql)) {
  echo "Mise à jour des données réussie";
} else {
  echo "Erreur dans la mise à jour des données: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
