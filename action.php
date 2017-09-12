<?php
// check if there user entered message
$value = $_POST['Message'];

if (strlen($value) < 20){
    $popUp = "Please add more description to your message";
    echo "<script type='text/javascript'>alert('$popUp');</script>";
}
else{
    // for emailing
    if(isset($_POST['submit'])) {
        $to      = 'csec.utsc@gmail.com';
        $subject = 'CSEC WEBSITE';
        $message = 'Name: ' . ($_POST['Name']) 
          . "\n" . 'Email: ' . ($_POST['Email']) 
          . "\n" . 'Phone: ' . ($_POST['Phone'])
          . "\n" . 'Message: ' . ($_POST['Message']);

        mail($to, $subject, $message);

        $popUp = "Your feedback has been recorded. Thank you";
        echo "<script type='text/javascript'>alert('$popUp');</script>";

        header( "refresh:0;url=index.html" );
    } 
    else {
      header('Location: index.html');
    }
}
header( "refresh:0;url=index.html" );
?>