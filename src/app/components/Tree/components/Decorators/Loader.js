import React from 'react'
import ContentLoader from 'react-content-loader'

const Loader = props => {
  return (
    <ContentLoader
      width={450}
      height={700}
      viewBox="0 0 450 700"
      backgroundColor="#f5f5f5"
      foregroundColor="#dbdbdb"
      {...props}
    >
      <rect x="0" y="5" rx="3" ry="3" width="350" height="50" />
      
      <rect x="0" y="70" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="105" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="140" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="175" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="210" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="245" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="280" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="315" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="350" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="385" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="420" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="455" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="490" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="525" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="560" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="595" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="630" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="665" rx="3" ry="3" width="350" height="30" />
      <rect x="0" y="700" rx="3" ry="3" width="350" height="30" />      
    </ContentLoader>
  )
}

export default Loader