<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8">
    <title>Sistema de Assinatura Digital - HSFA-Saúde</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="Sistema de assinatura digital do Hospital São Francisco de Assis" name="description">
    <meta content="assinatura digital, carimbo, hsfa" name="keywords">

    <!-- Favicon -->
    <link href="../img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&family=Roboto:wght@500;700&display=swap" rel="stylesheet">

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="../lib/animate/animate.min.css" rel="stylesheet">
    <link href="../lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="../lib/lightbox/css/lightbox.min.css" rel="stylesheet">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="../css/style.css" rel="stylesheet">

    <style>
        body {
            overflow-x: hidden;
        }

        .sistema-container {
            background: white;
            border-radius: 0;
            box-shadow: none;
            padding: 0;
            margin: 0;
            width: 100%;
            overflow-x: hidden;
        }

        .sistema-container iframe {
            width: 100%;
            min-height: 1200px;
            border: none;
            border-radius: 0;
            display: block;
        }

        @media (max-width: 768px) {
            .sistema-container {
                padding: 0;
                margin: 0;
            }

            .sistema-container iframe {
                min-height: 1400px;
            }
        }

        @media (max-width: 480px) {
            .sistema-container iframe {
                min-height: 1600px;
            }
        }

    </style>
</head>

<body>
    <!-- Spinner Start -->
    <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
    </div>
    <!-- Spinner End -->

    <!-- Topbar Start -->
    <div class="container-fluid text-white d-none d-lg-flex" style="background-color: #196F75;">
        <div class="container py-3">
            <div class="d-flex align-items-center">
                <a href="../index.php">
                    <img src="../img/logoBranca.png" height="70">
                </a>
                <div class="ms-auto d-flex align-items-center">
                    <small class="ms-4"><i class="fa fa-map-marker-alt me-3"></i>R. 9-A - St. Aeroporto, Goiânia - GO, 74075-250</small>
                    <small class="ms-4"><i class="fa fa-envelope me-3"></i>sac@hsfasaude.com.br</small>
                    <small class="ms-4"><i class="fa fa-phone-alt me-3"></i>(62) 3221-8000</small>
                    <div class="ms-3 d-flex">
                        <a class="btn btn-sm-square btn-light text-primary rounded-circle ms-2" target="_blank" href="https://web.facebook.com/hospitalsaofranciscodeassisgoiania"><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-sm-square btn-light text-primary rounded-circle ms-2" target="_blank" href="https://www.linkedin.com/company/hospitalsaofranciscodeassis"><i class="fab fa-linkedin-in"></i></a>
                        <a class="btn btn-sm-square btn-light text-primary rounded-circle ms-2" target="_blank" href="https://www.instagram.com/hospitalsaofranciscodeassis/"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Topbar End -->

    <!-- Navbar Start -->
    <div class="container-fluid bg-white sticky-top">
        <div class="container">
            <nav class="navbar navbar-expand-lg bg-white navbar-light p-lg-0">
                <a href="../index.php" class="navbar-brand d-lg-none">
                    <img src="../img/black-logo.png" height="70">
                </a>
                <button type="button" class="navbar-toggler me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <?php include('../menu.php');?>
                </div>
            </nav>
        </div>
    </div>
    <!-- Navbar End -->

    <!-- Sistema Container Start -->
    <div class="sistema-container">
        <iframe src="carimbo.html" title="Sistema de Assinatura Digital"></iframe>
    </div>
    <!-- Sistema Container End -->

    <!-- Footer Start -->
    <div class="container-fluid footer mt-5 py-5 wow fadeIn" style="background-color: #196F75;" data-wow-delay="0.1s">
        <div class="container py-1">
            <div class="col-lg-12">
                <h4 class="text-white text-center">
                    Agende seus exames e suas consultas pelo nosso whatsapp, clique no ícone para agendar seu horário
                    <a href="https://wa.me/5562996476186" target="_blank"><img src="../img/whats.png" height="50"></a>
                </h4>
            </div>
        </div>
    </div>
    <!-- Footer End -->

    <?php include('../fundo.php');?>

    <!-- Copyright Start -->
    <div class="container-fluid copyright py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    &copy; <a class="fw-medium text-light" href="#">Hsfa saúde</a>, Todos os direitos reservados.
                </div>
                <div class="col-md-6 text-center text-md-end">
                    Desenvolvido por: <a class="fw-medium text-light" href="https://portalquest.com.br">PortalQuest Agência</a>
                </div>
            </div>
        </div>
    </div>
    <!-- Copyright End -->

    <!-- Back to Top -->
    <a href="#" class="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"><i class="bi bi-arrow-up"></i></a>

    <!-- WhatsApp Float -->
    <a href="https://wa.me/5562996476186" style="position:fixed;width:60px;height:60px;bottom:110px;right:30px;background-color:#25d366;color:#FFF;border-radius:50px;text-align:center;font-size:30px;box-shadow: 1px 1px 2px #888;z-index:1000;" target="_blank">
        <i style="margin-top:16px" class="fa fa-whatsapp"></i>
    </a>

    <!-- JavaScript Libraries -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../lib/wow/wow.min.js"></script>
    <script src="../lib/easing/easing.min.js"></script>
    <script src="../lib/waypoints/waypoints.min.js"></script>
    <script src="../lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="../lib/lightbox/js/lightbox.min.js"></script>
    <script src="../js/main.js"></script>
</body>

</html>

