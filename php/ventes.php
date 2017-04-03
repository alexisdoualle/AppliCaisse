<?php
header("Content-Type: application/json; charset=UTF-8");

$date = date("Y-m-d"); // aujourd'hui

//connexion:
include 'connexiondb.php';

//requête:
$req = "SELECT `date_vente`,`qte_vente`, v.id_produit, `nom_produit`, `prix_produit`, `total_vente` FROM ventes v INNER JOIN produits p on v.id_produit = p.id_produit ORDER BY date_vente ASC";
//WHERE date(date_vente) = '".$date."'
$result = $conn->query($req);

//chaine '$outp' qui va servir de réponse en JSON:
$outp = "";
//tranforme chaque ligne '$rs' en JSON:
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";} //ajoute une virgule entre chaque élément, sauf le premier
    $outp .= '{"nom_produit":"'  . $rs["nom_produit"] . '",';
    $outp .= '"date_vente":"'  . $rs["date_vente"] . '",';
    $outp .= '"id_produit":"'  . $rs["id_produit"] . '",';
    $outp .= '"total_vente":'  . $rs["total_vente"] . ',';
    $outp .= '"prix_produit":'  . $rs["prix_produit"] . ',';
    $outp .= '"qte_vente":'. $rs["qte_vente"]  .'}';
}
$outp ='{"resultat":['.$outp.']}';

mysqli_close($conn); //ferme la connexion

echo($outp);//retourne la requête (sous format JSON)

?>
