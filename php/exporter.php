<?php
//récupère les données JSON du POST et les met dans $data:
$data = json_decode(file_get_contents("php://input"));

//connexion à la db:
include 'connexiondb.php';

$mois = mysqli_real_escape_string($conn,$data->mois);

ini_set('display_errors',1);
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=data.csv');
$output = fopen('php://output', 'w');

$sql = 'SELECT `date_vente`, `nom_produit`, `qte_vente`, `prix_produit`, tva_produit
        FROM ventes v INNER JOIN produits p on v.id_produit = p.id_produit
        WHERE SUBSTRING(`date_vente`,1,7)="'.$mois.'"
        ORDER BY date_vente ASC';
$rows = mysqli_query($conn, $sql);
fputcsv($output, array("Periode: ".$mois), ';');
$titres = array('Date', 'qte', 'Produit', 'Prix', 'TVA','Sous total','HT');
fputcsv($output, $titres, ';');
$total = 0;
while ($row = mysqli_fetch_assoc($rows)) {
  $sousTotal = $row['qte_vente']*$row['prix_produit'];
  $sousTotalHT = $sousTotal*(1-($row['tva_produit']/100));
  $total += $sousTotal;
  $totalHT += $sousTotalHT;
  array_push($row, $sousTotal."e");
  array_push($row, $sousTotalHT."e");
  fputcsv($output, $row, ';');
}
fputcsv($output, array("","","","","Total:",$total."e",$totalHT."e"), ';');


?>
