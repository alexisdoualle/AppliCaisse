<?php
header("Content-Type: application/json; charset=UTF-8");

//connexion:
include 'connexiondb.php';

//requête:
$req = "SELECT * FROM produits WHERE actif_produit=1 ORDER BY `ordre_produit`";
//WHERE date(date_vente) = '".$date."'
$result = $conn->query($req);

//chaine '$outp' qui va servir de réponse en JSON:
$outp = "";
//tranforme chaque ligne '$rs' en JSON:
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";} //ajoute une virgule entre chaque élément, sauf le premier
    $outp .= '{"id_produit":"'  . $rs["id_produit"] . '",';
    $outp .= '"nom_produit":"'  . $rs["nom_produit"] . '",';
    $outp .= '"prix_produit":"'  . $rs["prix_produit"] . '",';
    $outp .= '"tva_produit":'  . $rs["tva_produit"] . ',';
    $outp .= '"ordre_produit":'  . $rs["ordre_produit"] . ',';
    $outp .= '"couleur_produit":"'  . $rs["couleur_produit"] . '",';
    $outp .= '"hh_produit":'. $rs["hh_produit"]  .'}';
}
$outp ='{"resultat":['.$outp.']}';

mysqli_close($conn); //ferme la connexion

echo($outp);//retourne la requête (sous format JSON)

?>
