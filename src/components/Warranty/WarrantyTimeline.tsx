import React from 'react';

interface TimelineItem {
  actionDate: string;
  actionName: string;
  description: string;
  customerName:string |null;
}

interface WarrantyTimelineProps {
  timelines: TimelineItem[];
  serialCode: string;
}

const WarrantyTimeline: React.FC<WarrantyTimelineProps> = ({ timelines, serialCode }) => {
  if (!timelines || timelines.length === 0) {
    return (
      <div style={{ marginTop: '20px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
        Chưa có dữ liệu lịch sử cho thiết bị này.
      </div>
    );
  }

  return (
    <div style={{marginTop: '25px',padding: '20px',backgroundColor: '#ffffff',borderRadius: '12px',border: '1px solid #e2e8f0',boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '20px',display: 'flex',alignItems: 'center',gap: '8px'}}>
        <span style={{ color: '#3b82f6' }}></span> Lịch sử thiết bị: <span style={{ color: '#2563eb' }}>{serialCode}</span>
      </h3>

      <div style={{ position: 'relative', paddingLeft: '30px' }}>
        <div style={{position: 'absolute',left: '7px',top: '5px',bottom: '5px',width: '2px',backgroundColor: '#e2e8f0'}} />

        {timelines.map((item, index) => (
          <div key={index} style={{ position: 'relative', marginBottom: '25px' }}>
            
            <div style={{position: 'absolute', left: '-30px', top: '4px',width: '16px',height: '16px',borderRadius: '50%',backgroundColor: index === 0 ? '#3b82f6' : '#94a3b8', border: '4px solid #fff',boxShadow: '0 0 0 1px #e2e8f0',zIndex: 1}} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                  {new Date(item.actionDate).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>

                <span style={{fontSize: '11px',fontWeight: 700,padding: '2px 10px',borderRadius: '20px',backgroundColor: index === 0 ? '#eff6ff' : '#f1f5f9',color: index === 0 ? '#2563eb' : '#475569',border: `1px solid ${index === 0 ? '#dbeafe' : '#e2e8f0'}`
                }}>
                  {item.actionName.toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5',padding: '8px 12px',backgroundColor: index === 0 ? '#f8fafc' : 'transparent',borderRadius: '8px',
                marginTop: '4px'
              }}>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarrantyTimeline;