<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // ======================
    // FORM DATA
    // ======================

    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // ======================
    // VALIDATION
    // ======================

    if(empty($name) || empty($email) || empty($phone)){

        echo "
        <script>
        alert('Please Fill All Fields');
        window.history.back();
        </script>
        ";

        exit();
    }

    // ======================
    // RECEIVER EMAIL
    // ======================

    $to = "afshank998@gmail.com";

    // ======================
    // SUBJECT
    // ======================

    $subject = "New Lead - SV Township Website";

    // ======================
    // EMAIL BODY
    // ======================

    $htmlContent = '

    <!DOCTYPE html>

    <html>

    <head>

        <meta charset="UTF-8">

        <title>New Lead</title>

    </head>

    <body style="margin:0;padding:20px;background:#f4f4f4;font-family:Arial,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">

            <tr>

                <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">

                        <tr>

                            <td style="background:#000;padding:20px;text-align:center;color:#fff;">

                                <h2 style="margin:0;">SV Township New Enquiry</h2>

                            </td>

                        </tr>

                        <tr>

                            <td style="padding:30px;">

                                <table width="100%" cellpadding="10" cellspacing="0" border="1" style="border-collapse:collapse;">

                                    <tr>

                                        <td width="180"><strong>Name</strong></td>

                                        <td>'.$name.'</td>

                                    </tr>

                                    <tr>

                                        <td><strong>Email</strong></td>

                                        <td>'.$email.'</td>

                                    </tr>

                                    <tr>

                                        <td><strong>Phone</strong></td>

                                        <td>'.$phone.'</td>

                                    </tr>

                                    <tr>

                                        <td><strong>Plot Size</strong></td>

                                        <td>'.$message.'</td>

                                    </tr>

                                    <tr>

                                        <td><strong>Date</strong></td>

                                        <td>'.date("d-m-Y h:i A").'</td>

                                    </tr>

                                </table>

                            </td>

                        </tr>

                        <tr>

                            <td style="background:#f1f1f1;padding:15px;text-align:center;font-size:14px;">

                                SV Township Website Lead

                            </td>

                        </tr>

                    </table>

                </td>

            </tr>

        </table>

    </body>

    </html>

    ';

    // ======================
    // HEADERS
    // ======================

    $headers = "MIME-Version: 1.0" . "\r\n";

    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    $headers .= "From: SV Township <noreply@" . $_SERVER['SERVER_NAME'] . ">" . "\r\n";

    $headers .= "Reply-To: ".$email."\r\n";

    // ======================
    // SEND EMAIL
    // ======================

    $mail = mail($to, $subject, $htmlContent, $headers);

    // ======================
    // SUCCESS
    // ======================

    if($mail){

        echo "

        <!DOCTYPE html>

        <html>

        <head>

            <title>Success</title>

            <script>

                alert('Thank You! Your Form Submitted Successfully');

                window.location.href='index.php';

            </script>

        </head>

        <body></body>

        </html>

        ";

    } else {

        echo "

        <!DOCTYPE html>

        <html>

        <head>

            <title>Error</title>

            <script>

                alert('Something Went Wrong');

                window.history.back();

            </script>

        </head>

        <body></body>

        </html>

        ";

    }

} else {

    header('Location:index.php');

    exit();

}

?>