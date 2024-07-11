import './RandupLogo.css';

export const RandupLogo = () => {

  return (
    <div className="logo randup-stack">
      <div className="logo-block block-1"></div>
      <div className="logo-block block-2">
        <div className="black" style={{width: '48px', left: '16px'}}></div>
      </div>
      <div className="logo-block block-3"></div>
      <div className="logo-block block-4">
        <div className="black" style={{width: '32px', left: '16px'}}></div>
        <div className="black" style={{width: '16px', left: '64px'}}></div>

      </div>
      <div className="logo-block block-5">
        <div className="black" style={{width: '48px', left: '16px'}}></div>
      </div>
    </div>
  );
}