const DashBoardLoader = () => {
    return (
      <div className="absalute inset-0 z-50 flex justify-center items-center pb-32 right-0 w-10/12 min-h-screen p-5 bg-[7c24f018]">
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="loader h-[20vh] w-[20vh] max-h-[480px] min-w-[480px]"
      >
        <defs>
          <path
            id="move-path"
            d="M102.546 83.5C109.859 70.8333 128.141 70.8333 135.454 83.5L157.971 122.5C165.284 135.167 156.143 151 141.517 151H96.4833C81.8571 151 72.7158 135.167 80.0289 122.5L102.546 83.5Z"
            fill="#7C24F0"
          ></path>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -32"
            ></feColorMatrix>
          </filter>
        </defs>
        <g filter="url(#goo)">
          <circle cx="119" cy="74" r="20" stroke="#7C24F0" strokeWidth="8"></circle>
          <circle cx="79" cy="141" r="20" stroke="#7C24F0" strokeWidth="8"></circle>
          <circle cx="157" cy="141" r="20" stroke="#7C24F0" strokeWidth="8"></circle>
          <circle cx="0" cy="0" r="14" fill="#7C24F0">
            <animateMotion
              path="M102.546 83.5C109.859 70.8333 128.141 70.8333 135.454 83.5L157.971 122.5C165.284 135.167 156.143 151 141.517 151H96.4833C81.8571 151 72.7158 135.167 80.0289 122.5L102.546 83.5Z"
              dur="2s"
              repeatCount="indefinite"
            ></animateMotion>
          </circle>
        </g>
        
      </svg>
      
    </div>
    );
   
  };
  
  export default DashBoardLoader;