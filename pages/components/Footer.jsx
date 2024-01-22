import instagramLogo from '../../public/instagram-logo.png'
import linkedInLogo from '../../public/linkedin-logo.png'
import githubLogo from '../../public/github-logo.png'
import Image from 'next/image'


function Footer(){
    return (
        <footer className="bottom-footer">
            <div className="footer-content">
                <div className="contact-info">
                <p className='less-height'>Contact me at: <a href="mailto:felipe.quiroga@torontomu.ca">felipe.quiroga@torontomu.ca</a></p>
                </div>
                <div className="social-links">
                <a href="https://www.instagram.com/q.feli" target="_blank" rel="noopener noreferrer">
                    <Image style={{ marginRight: '30px'}}src={instagramLogo} width={30} alt="Instagram" />
                </a>
                <a href="https://www.linkedin.com/in/felipe-quiroga-falcon" target="_blank" rel="noopener noreferrer">
                    <Image style={{ marginRight: '30px'}}src={linkedInLogo} width={30} alt="LinkedIN" />
                </a>
                <a href="https://github.com/feli-quiroga" target="_blank" rel="noopener noreferrer">
                    <Image style={{ marginRight: '30px'}}src={githubLogo} width={30} alt="Github" />    
                </a>
                </div>
            </div>
                <center><p className="less-height">This website was made using React</p></center>
                <center><p className="less-height">&copy; 2024 Felipe Quiroga. All rights reserved.</p></center>
        </footer>

    )
}

export default Footer