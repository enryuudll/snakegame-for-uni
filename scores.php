<?php
// Optional PHP handler to store scores on server
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) exit;

$name = htmlspecialchars($data['name']);
$score = intval($data['score']);

$entry = date('Y-m-d H:i:s') . " - $name: $score\n";
file_put_contents('scores.txt', $entry, FILE_APPEND);
echo "Saved";
?>
