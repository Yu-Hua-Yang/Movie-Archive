import DataBody from './DataBody';
import { useState } from 'react';
import MovieArchiveLogo from '../media/MovieArchive.png';

export default function SelectionPanel() {
  const [archiveView, setArchiveView] = useState(true);

  const handleArchiveViewClick = () => {
    setArchiveView(true);
  };

  const handleAnalyticViewClick = () => {
    setArchiveView(false);
  };
  
  return(
    <>
      <header>
        <div id='header'> 
          <div id='left-items'>
            <img id='movieArchiveLogo' src={MovieArchiveLogo} alt="MovieArchiveLogo"/>
          </div>
          <div id='right-items'>
            <button className='rightHeader' onClick={handleArchiveViewClick}>Archive</button>
            <button className='rightHeader' onClick={handleAnalyticViewClick}>Analytic</button>
          </div>
        </div>
      </header>
      <DataBody 
      archiveView = { archiveView }
      />
    </>
  );
}