<?php
header("Content-Type: application/json; charset=UTF-8");

//connexion:
include 'connexiondb.php';

//requête:
$req = "SELECT * FROM chiffreaffaire";
$result = $conn->query($req);

//chaine '$outp' qui va servir de réponse en JSON:
$outp = "";
//tranforme chaque ligne '$rs' en JSON:
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";} //ajoute une virgule entre chaque élément, sauf le premier
    $outp .= '{"id_ca":"'  . $rs["id_ca"] . '",';
    $outp .= '"date_ca":"'  . $rs["date_ca"] . '",';
    $outp .= '"montant_ca":'. $rs["montant_ca"]  .'}';
}
$outp ='{"resultat":['.$outp.']}';

mysqli_close($conn); //ferme la connexion

echo($outp);//retourne la requête (sous format JSON)

?>
