<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"));

//connexion à la db:
include 'connexiondb.php';

$dateCA = mysqli_real_escape_string($conn,$data->dateCA);
$montantCA = mysqli_real_escape_string($conn,$data->montantCA);

$sql = "INSERT INTO `chiffreaffaire`( `date_ca`, `montant_ca`) VALUES ('".$dateCA."',".$montantCA.")";

if(mysqli_query($conn,$sql)) { //envoie la requete
  echo "Mise à jour des données";
} else {
  echo "Erreur dans la mise à jour des données: " . mysqli_error($conn);
}


mysqli_close($conn);

?>
