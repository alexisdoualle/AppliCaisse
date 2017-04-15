<?php
header("Content-Type: application/json; charset=UTF-8");

$date = date("Y-m-d"); // aujourd'hui

//connexion:
include 'connexiondb.php';

//requête:
$req = "SELECT d.id_depense, `date_depense`, `montant_depense`, `nom_typedepense`
        FROM depenses d INNER JOIN typedepense t on d.type_depense = t.id_typedepense
        ORDER BY `date_depense` ASC";
//WHERE date(date_vente) = '".$date."'
$result = $conn->query($req);

//chaine '$outp' qui va servir de réponse en JSON:
$outp = "";
//tranforme chaque ligne '$rs' en JSON:
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";} //ajoute une virgule entre chaque élément, sauf le premier
    $outp .= '{"nom_typedepense":"'  . $rs["nom_typedepense"] . '",';
    $outp .= '"date_depense":"'  . $rs["date_depense"] . '",';
    $outp .= '"id_depense":"'  . $rs["id_depense"] . '",';
    $outp .= '"montant_depense":'. $rs["montant_depense"]  .'}';
}
$outp ='{"resultat":['.$outp.']}';

mysqli_close($conn); //ferme la connexion

echo($outp);//retourne la requête (sous format JSON)

?>
