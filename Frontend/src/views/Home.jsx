import NavBar from '../componentes/NavBar';
import Footer from '../componentes/Footer';
import Logo from '../assets/HMÑ.jpg';
import Logo2 from '../assets/Dormitorio.jpg';
import Logo3 from '../assets/Outdoor.jpg';
import Logo4 from '../assets/Regalos.jpg'
import { GoGift } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { SiMaterialformkdocs } from "react-icons/si";
import { FaRegStar } from "react-icons/fa";




const benefits = [
  {
    icon: <FaRegHeart />,
    title: 'Dettalles con amor',
    text: 'Cada producto es de excelente calidad.',
  },
  {
    icon: <SiMaterialformkdocs />,
    title: 'Materiales confiables',
    text: 'Trabajamos con materiales seleccionados y sustentables.',
  },
  {
    icon: <GoGift />,
    title: 'Ideal para regalar',
    text: 'Disenos unicos para momentos inolvidables.',
  },
  {
    icon: <FaRegStar />,
    title: 'Exclusivo y personal',
    text: 'Creamos productos que reflejan tu estilo.',
  },
];


function Home() {
  return (
    <>
    <NavBar />
    <main className="homePage">

      <section className="heroSection" id="inicio">
        <div className="heroContent">
          <p className="heroEyebrow">Detalles que</p>
          <h1>cuentan historias</h1>
          <div className="sectionDivider">
            <span></span>
            <b>♥</b>
            <span></span>
          </div>
          <p className="heroCopy">
            Productos para el hogar, que hacen unicos tus momentos especiales. 
          </p>
          <a className="primaryButton" href="#productos">Conoce mas</a>
        </div>
      </section>

      <section className="benefitsStrip" id="sobre-mi">
        {benefits.map((benefit) => (
          <article className="benefitItem" key={benefit.title}>
            <div className="benefitIcon">{benefit.icon}</div>
            <h2>{benefit.title}</h2>
            <p>{benefit.text}</p>
          </article>
        ))}
      </section>

      <section className="featuredSection" id="productos">
        <p className="sectionTitle">Productos destacados</p>
        <div className="sectionDivider small">
          <span></span>
          <b>♥</b>
          <span></span>
        </div>

        <div className="tarjetas-destacadas">
          
            <article className="productCard">
              <img src={Logo} alt= "Hombre, Mujer y Niño"/>
              <div>
                <h3>Hombre, Mujer y Niño</h3>
                <p>Contamos con una amplia selección de productos para cada necesidad.</p>
              </div>
            </article>
          
        
       
          
            <article className="productCard">
              <img src={Logo2} alt= "Dormitorio"/>
              <div>
                <h3>Dormitorio</h3>
                <p>Contamos con una amplia selección de productos para cada necesidad.</p>
              </div>
            </article>
        
        
        
          
            <article className="productCard">
              <img src={Logo3} alt="Deportes, Outdoor y Camping" />
              <div>
                <h3>Deportes, Outdoor y Camping</h3>
                <p>Contamos con una amplia selección de productos para cada necesidad.</p>
              </div>
            </article>
          
    
       
          
            <article className="productCard" >
              <img src={Logo4} alt="Regalos y más!"/>
              <div>
                <h3>Regalos y más!</h3>
                <p>Contamos con una amplia selección de productos para cada necesidad.</p>
              </div>
            </article>
          
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}

export default Home;
