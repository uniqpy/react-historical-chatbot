import { useEffect, useRef, useState } from 'react';
import feather from 'feather-icons';

/**
 * This function creates the content for the help page. The class names are a result of the use of the bootstrap library. 
 * The help page will provide information on the chatbot and solutions to any common issues. Otherwise it will provide a contact address for further support.
 * @returns 
 */

export default function HelpPage(){
    const [topic] = useState('Help');

      return (
    <div className="container-fluid px-3 h-flex">
        <div className="col-12 col-lg-9 py-3 flex-col">
          <div className="card rounded-3 shadow-sm border h-100">
            <div className="card-body d-flex flex-column">
              <h1 className="h4 mb-3">{CONTENT[topic].title}</h1>
              <div className="text-body flex-grow-1 overflow-auto">
                {CONTENT[topic].body.split('\n').map((line, idx) => {
                  const t = line.trim();
                  if (!t) return <p key={idx} className="mb-2">&nbsp;</p>;
                  if (t.startsWith('- ')) {
                    return <p key={idx} className="mb-1">{t}</p>;
                  }
                  if (t.endsWith(':')) {
                    return <h2 key={idx} className="h6 mt-3">{t.replace(':','')}</h2>;
                  }
                  return <p key={idx} className="mb-2">{t}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}


const CONTENT = {
    Help:{
        title: 'Need help?',
        body: `
Here are some fixes that should fix any issues you may have
-If you get an error about input length being too large, try sending a message with fewer characters.
-Use simple characters, things like emoji's are not supported. 
-The bot is not able to respond with styling (making messages bold or in italitcs)
-The replies can take a while to generate, so please be patient. 

If these tips don't work, can't find the solution to your problem or want to send feedback email us at: caligulasupport@caligula.net
        `
    }
}