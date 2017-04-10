<?php
header("Content-Type: application/json; charset=UTF-8");

//connexion:
include 'connexiondb.php';

//requête:
$req = "SELECT * FROM typedepense";

$result = $conn->query($req);

//chaine '$outp' qui va servir de réponse en JSON:
$outp = "";
//tranforme chaque ligne '$rs' en JSON:
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";} //ajoute une virgule entre chaque élément, sauf le premier
    $outp .= '{"id_typedepense":'  . $rs["id_typedepense"] . ',';
    $outp .= '"nom_typedepense":"'. $rs["nom_typedepense"]  .'"}';
}
$outp ='{"resultat":['.$outp.']}';

mysqli_close($conn); //ferme la connexion

echo($outp);//retourne la requête (sous format JSON)

?>
