
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8">
    <title>HSFA-Saúde - Goiânia GO</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">

    <!-- Favicon -->
    <link href="img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&family=Roboto:wght@500;700&display=swap"
        rel="stylesheet">

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="lib/animate/animate.min.css" rel="stylesheet">
    <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="lib/lightbox/css/lightbox.min.css" rel="stylesheet">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="css/style.css" rel="stylesheet">
</head>

<body>
    <!-- Spinner Start -->
    <div id="spinner"
        class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
    </div>
    <!-- Spinner End -->


    <!-- Topbar Start -->
    <div class="container-fluid  text-white d-none d-lg-flex" style="background-color: #196F75;">
        <div class="container py-3">
            <div class="d-flex align-items-center">
                <a href="index.html">
                    <img src="img/logoBranca.png" height="70">
                </a>
                <div class="ms-auto d-flex align-items-center">
                    <small class="ms-4"><i class="fa fa-map-marker-alt me-3"></i>R. 9-A - St. Aeroporto, Goiânia - GO, 74075-250</small>
                    <small class="ms-4"><i class="fa fa-envelope me-3"></i>sac@hsfasaude.com.br</small>
                    <small class="ms-4"><i class="fa fa-phone-alt me-3"></i>(62) 3221-8000</small>
                    <div class="ms-3 d-flex">
                        <a class="btn btn-sm-square btn-light text-primary rounded-circle ms-2"  target="_blank" href="https://web.facebook.com/hospitalsaofranciscodeassisgoiania?_rdc=1&_rdr"><i
                                class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-sm-square btn-light text-primary rounded-circle ms-2"  target="_blank" href="https://www.linkedin.com/company/hospitalsaofranciscodeassis"><i
                                class="fab fa-linkedin-in"></i></a>
                        <a class="btn btn-sm-square btn-light text-primary rounded-circle ms-2"  target="_blank" href="https://www.instagram.com/hospitalsaofranciscodeassis/"><i
                                class="fab fa-instagram-in"></i></a>
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
                <a href="index.php" class="navbar-brand d-lg-none">
                    <img src="img/logoBranca.png" height="70">
                </a>
                <button type="button" class="navbar-toggler me-0" data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                 <?php include('menu.php');?>
                </div>
            </nav>
        </div>
    </div>
    <!-- Navbar End -->



    <!-- Carousel Start -->
    <div class="container-fluid px-0 mb-5">
        <div id="header-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-inner">

                <div class="carousel-item active">
                    <img class="w-100" src="img/carousel-1.jpg" alt="Image">
                    <div class="carousel-caption">
                        <div class="container">
                            <div class="row justify-content-end">
                                <div class="col-lg-7 text-center">
                                    <p class="fs-4 text-white animated slideInLeft"></p>
                                    <h1 class="display-1 text-white mb-5 animated slideInLeft"></h1>
                                   
                                </div>
                            </div>
                        </div>
                </div>
                
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
    <!-- Carousel End -->


    <!-- Team Start -->
    <div class="container-xxl py-5">
      <div class="container">
      <div class="text-center text-md-start pb-5 pb-md-0 wow fadeInUp" data-wow-delay="0.1s"
                style="max-width: 500px;">
                <p class="fs-5 fw-medium text-primary">HSFA-SAÚDE</p>
                <h1 class="display-5 mb-5"> DIFERENCIAIS</h1>
            </div>

          <div class="row g-4">



               <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                  <div class="team-item rounded overflow-hidden pb-4">
                      <img class="img-fluid mb-4" src="diferenciais/planoSeguranca.jpg" alt="">
                      <h5>Plano de Segurança ao Paciente
</h5>
                      <span class="text-primary">Saiba Mais</span>
                      <ul class="team-social">
                          <li><a class="btn btn-square" href=""><i class="fab fa-whatsapp"></i></a></li>
                          <li><a class="btn btn-square" href=""><i class="fab fa-instagram"></i></a></li>
                      </ul>
                  </div>
               </div>


               
               <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                  <div class="team-item rounded overflow-hidden pb-4">
                      <img class="img-fluid mb-4" src="diferenciais/acomodacoes.jpg" alt="">
                      <h5>Acomodações
</h5>
                      <span class="text-primary">Saiba Mais</span>
                      <ul class="team-social">
                          <li><a class="btn btn-square" href=""><i class="fab fa-whatsapp"></i></a></li>
                          <li><a class="btn btn-square" href=""><i class="fab fa-instagram"></i></a></li>
                      </ul>
                  </div>
               </div>




               
               <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                  <div class="team-item rounded overflow-hidden pb-4">
                      <img class="img-fluid mb-4" src="diferenciais/utiHumanizada.jpg" alt="">
                      <h5>UTI humanizada
</h5>
                      <span class="text-primary">Saiba Mais</span>
                      <ul class="team-social">
                          <li><a class="btn btn-square" href=""><i class="fab fa-whatsapp"></i></a></li>
                          <li><a class="btn btn-square" href=""><i class="fab fa-instagram"></i></a></li>
                      </ul>
                  </div>
               </div>

               
               <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                  <div class="team-item rounded overflow-hidden pb-4">
                      <img class="img-fluid mb-4" src="diferenciais/farmacia.jpg" alt="">
                      <h5>Farmácia Clínica</h5>
                      <span class="text-primary">Saiba Mais</span>
                      <ul class="team-social">
                          <li><a class="btn btn-square" href=""><i class="fab fa-whatsapp"></i></a></li>
                          <li><a class="btn btn-square" href=""><i class="fab fa-instagram"></i></a></li>
                      </ul>
                  </div>
               </div>


               
               <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                  <div class="team-item rounded overflow-hidden pb-4">
                      <img class="img-fluid mb-4" src="diferenciais/equipeMultidiciplinar.jpg" alt="">
                      <h5>Equipe Multidisciplinar</h5>
                      <span class="text-primary">Saiba Mais</span>
                      <ul class="team-social">
                          <li><a class="btn btn-square" href=""><i class="fab fa-whatsapp"></i></a></li>
                          <li><a class="btn btn-square" href=""><i class="fab fa-instagram"></i></a></li>
                      </ul>
                  </div>
               </div>




               
               <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                  <div class="team-item rounded overflow-hidden pb-4">
                      <img class="img-fluid mb-4" src="diferenciais/prontoSocorro.jpg" alt="">
                      <h5>Pronto Socorro 24 horas</h5>
                      <span class="text-primary">Saiba Mais</span>
                      <ul class="team-social">
                          <li><a class="btn btn-square" href=""><i class="fab fa-whatsapp"></i></a></li>
                          <li><a class="btn btn-square" href=""><i class="fab fa-instagram"></i></a></li>
                      </ul>
                  </div>
               </div>
              


          </div>
      </div>
  </div>
  <!-- Team End -->


  <!-- Footer Start -->
  <div class="container-fluid footer mt-5 py-5 wow fadeIn" style="background-color: #196F75;" data-wow-delay="0.1s">
   <div class="container py-1">
        
    
       <div class="col-lg-12">&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp
       &nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp<h4 class="text-white">Agende seus exames e suas consultas pelo nosso whatsapp, clique no
         ícone para agendar seu horário &nbsp &nbsp<a  href="https://wa.me/5562996476186" target="_blank"> <img src="img/whats.png" height="50"></a></h4>
       </div>

               
       </div>
   </div>
<!-- Footer End -->


    <!-- Cadi -->


     <div class="container-xxl py-5">
        <div class="container">
            <div class="row g-5">
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                   <img src="img/about.jpg">
                </div>
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                <h1 class="display-6 mb-4"><img src="img/logo-cadi.png" height="90"></h1>
                        <p class="mb-4">Através de uma tecnologia de ponta com técnica médica em ressonância nuclear magnética,
                             realizamos os mais modernos e complexos exames de diagnóstico por imagem, proporcionando resultados
                              precisos e um atendimento eficiente.</p>
                        
                        <a class="btn btn-primary rounded-pill py-3 px-5" href="">Saiba Mais</a>
                </div>
            </div>
        </div>
    </div>
                  
    <!-- Fim Cadi -->





   


    <!-- Project Start -->
    <div class="container-xxl pt-5">
        <div class="container">
            <div class="text-center text-md-start pb-5 pb-md-0 wow fadeInUp" data-wow-delay="0.1s"
                style="max-width: 500px;">
                <p class="fs-5 fw-medium text-primary">HSFA-SAÚDE</p>
                <h1 class="display-5 mb-5">NOSSOS EXAMES</h1>
            </div>
            <div class="owl-carousel project-carousel wow fadeInUp" data-wow-delay="0.1s">


                <div class="project-item mb-5">
                    <div class="position-relative">
                        <img class="img-fluid" src="img/" alt="">
                        <div class="project-overlay">
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href="img/project-1.jpg"
                                data-lightbox="project"><i class="fa fa-eye"></i></a>
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href=""><i
                                    class="fa fa-link"></i></a>
                        </div>
                    </div>
                    <div class="p-4">
                        <a class="d-block h5" href="">UTI humanizada</a>
                    </div>
                </div>


                <div class="project-item mb-5">
                    <div class="position-relative">
                        <img class="img-fluid" src="img/" alt="">
                        <div class="project-overlay">
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href="img/project-1.jpg"
                                data-lightbox="project"><i class="fa fa-eye"></i></a>
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href=""><i
                                    class="fa fa-link"></i></a>
                        </div>
                    </div>
                    <div class="p-4">
                        <a class="d-block h5" href="">UTI humanizada</a>
                    </div>
                </div>


                <div class="project-item mb-5">
                    <div class="position-relative">
                        <img class="img-fluid" src="img/" alt="">
                        <div class="project-overlay">
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href="img/project-1.jpg"
                                data-lightbox="project"><i class="fa fa-eye"></i></a>
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href=""><i
                                    class="fa fa-link"></i></a>
                        </div>
                    </div>
                    <div class="p-4">
                        <a class="d-block h5" href="">UTI humanizada</a>
                    </div>
                </div>



                <div class="project-item mb-5">
                    <div class="position-relative">
                        <img class="img-fluid" src="img/" alt="">
                        <div class="project-overlay">
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href="img/project-1.jpg"
                                data-lightbox="project"><i class="fa fa-eye"></i></a>
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href=""><i
                                    class="fa fa-link"></i></a>
                        </div>
                    </div>
                    <div class="p-4">
                        <a class="d-block h5" href="">UTI humanizada</a>
                    </div>
                </div>



                <div class="project-item mb-5">
                    <div class="position-relative">
                        <img class="img-fluid" src="img/" alt="">
                        <div class="project-overlay">
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href="img/project-1.jpg"
                                data-lightbox="project"><i class="fa fa-eye"></i></a>
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href=""><i
                                    class="fa fa-link"></i></a>
                        </div>
                    </div>
                    <div class="p-4">
                        <a class="d-block h5" href="">UTI humanizada</a>
                    </div>
                </div>




                <div class="project-item mb-5">
                    <div class="position-relative">
                        <img class="img-fluid" src="img/" alt="">
                        <div class="project-overlay">
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href="img/project-1.jpg"
                                data-lightbox="project"><i class="fa fa-eye"></i></a>
                            <a class="btn btn-lg-square btn-light rounded-circle m-1" href=""><i
                                    class="fa fa-link"></i></a>
                        </div>
                    </div>
                    <div class="p-4">
                        <a class="d-block h5" href="">UTI humanizada</a>
                    </div>
                </div>


               

              
                </div>
            </div>
        </div>
    </div>
    <!-- Project End -->


    
    <!-- Plamed -->

    
    <div class="container-xxl py-5">
        <div class="container">
            <div class="row g-5">
                <div class="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
                   <img src="img/imagem-plamed.jpg" height="400">
                </div>
                <div class="col-lg-4 wow fadeInUp" data-wow-delay="0.5s">
                  <h1 class="display-6 mb-4"><img src="img/logo_plamed.png" height="50"></h1>
                        <p class="mb-4">Através de uma tecnologia de ponta com técnica médica em ressonância nuclear magnética,
                             realizamos os mais modernos e complexos exames de diagnóstico por imagem, proporcionando resultados
                              precisos e um atendimento eficiente.</p>
                        
                        <a class="btn btn-primary rounded-pill py-3 px-5" href="">Saiba Mais</a>
                </div>
            </div>
        </div>
    </div>
                  
    <!-- fim Plamed -->


       
                    

     <?php include('fundo.php');?>

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
    <a href="#" class="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"><i
            class="bi bi-arrow-up"></i></a>


    <!-- JavaScript Libraries -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="lib/wow/wow.min.js"></script>
    <script src="lib/easing/easing.min.js"></script>
    <script src="lib/waypoints/waypoints.min.js"></script>
    <script src="lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="lib/lightbox/js/lightbox.min.js"></script>

    <!-- Template Javascript -->
    <script src="js/main.js"></script>
</body>

</html>