<?php
header("Access-Control-Allow-Origin: *");  

$connect = new PDO("mysql:host=twommexdgn1622.mysql.db;dbname=twommexdgn1622;charset=utf8", "twommexdgn1622", "Aqwzsxedc123");
//$connect = new PDO("mysql:host=localhost.mysql.db;dbname=stations;charset=utf8", "root", "");


$post_data = json_decode(file_get_contents("php://input"));

$response = array();

if ($post_data->action == "register" ) {

    // On vérifie que l'utilisateur n'existe pas 
    $req = $connect->prepare("SELECT * FROM glisse_clients WHERE user_mail = :user_mail");
    $req->execute(array("user_mail" => $post_data->user_mail));

    if ($data = $req->fetch()) {
        // sinon : si l'utilisateur n'esite pas
        $response['header'] = 'register';
        $response['state'] = 400;
    } else {
    
        // On crée une nouvelle ligne dans la bdd pour ce nouvel utilisateur
        $req = $connect->prepare("INSERT INTO glisse_clients (user_mail, user_password) values(:user_mail, :user_password)");
    
        $req->execute(array(
            "user_mail" => $post_data->user_mail,
            "user_password" => sha1($post_data->user_password)
        ));
    
        $response['header'] = 'register';
        $response['state'] = 200;
    
    }
        

} else if ($post_data->action == "login") {
    // si l'user veur se conneccter 

    $crypted_password = sha1($post_data->user_password);

    $req = $connect->prepare("SELECT * FROM glisse_clients WHERE user_mail = :user_mail AND user_password = :user_password");
    $req->execute(array(
        "user_mail" => $post_data->user_mail, 
        "user_password" => $crypted_password
    ));  

    if ($user = $req->fetch()) {

        


        // Si la connexion est réussie
        $response['header'] = 'login';
        $response['state'] = 200;
        $response['data'] = $user;

        // on récupéère les favoris du client
        $req2 = $connect->prepare("SELECT * FROM glisse_favoris WHERE user_uid = :user_uid");
        $req2->execute(array(
            "user_uid" => $user['user_uid']
        ));   
        
        // tant qu'on trouve des favorus correspondant à l'user on les ajoute 
        //      dans la liste de ses favoris
        while($fav = $req2->fetch()) {
            $response['data']['favoris'][] = $fav;
        }
        
    } else {
        // si mdp est différent du mdp enregistré
        //      on renvoit une erreur vers l'application 
        $response['header'] = 'login';
        $response['state'] = 400; 
    }

}


echo json_encode($response);


?>