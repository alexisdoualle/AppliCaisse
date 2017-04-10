<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"));

//connexion à la db:
include 'connexiondb.php';

$ancienneDate = mysqli_real_escape_string($conn,$data->ancienneDate);
$nouvelleDate = mysqli_real_escape_string($conn,$data->nouvelleDate);


$sql = "UPDATE ventes SET `date_vente`='".$nouvelleDate."' WHERE `date_vente`='".$ancienneDate."'";
if(mysqli_query($conn,$sql)) {
  echo "Mise à jour des données réussie";
} else {
  echo "Erreur dans la mise à jour des données: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
