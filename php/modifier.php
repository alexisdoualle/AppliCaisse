<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"));

//connexion à la db:
include 'connexiondb.php';

$produit = mysqli_real_escape_string($conn,$data->produit);
$nouveauNom = mysqli_real_escape_string($conn,$data->nouveauNom);
$nouveauPrix = mysqli_real_escape_string($conn,$data->nouveauPrix);
$nouvelleTva = mysqli_real_escape_string($conn,$data->nouvelleTva);

$sql = "UPDATE produits SET `nom_produit`='".$nouveauNom."', `prix_produit`=".$nouveauPrix.", `tva_produit`=".$nouvelleTva." WHERE `nom_produit`='".$produit."'";

if(mysqli_query($conn,$sql)) {
  echo "Mise à jour des données réussie";
} else {
  echo "Erreur dans la mise à jour des données: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
