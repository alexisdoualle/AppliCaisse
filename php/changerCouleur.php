<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"));

//connexion à la db:
include 'connexiondb.php';

$produit = mysqli_real_escape_string($conn,$data->produit);
$nouvelleCouleur = mysqli_real_escape_string($conn,$data->nouvelleCouleur);


$sql = "UPDATE produits SET `couleur_produit`='".$nouvelleCouleur."' WHERE `nom_produit`='".$produit."'";
if(mysqli_query($conn,$sql)) {
  echo "Mise à jour des données réussie";
} else {
  echo "Erreur dans la mise à jour des données: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
