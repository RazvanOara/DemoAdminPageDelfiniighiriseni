import React, { useState, useEffect } from 'react';

const WorkoutPreview = () => {
  const [workout, setWorkout] = useState({ name: '', items: [] });
  const [isLoading, setIsLoading] = useState(true);

  const strokeTypes = [
    { value: 'freestyle', label: 'Freestyle', short: 'Fr' },
    { value: 'backstroke', label: 'Backstroke', short: 'Bk' },
    { value: 'breaststroke', label: 'Breaststroke', short: 'Br' },
    { value: 'butterfly', label: 'Butterfly', short: 'Fly' },
    { value: 'choice', label: "Swimmer's Choice", short: 'Ch' },
    { value: 'IM', label: 'Individual Medley', short: 'IM' },
    { value: 'IM-by-round', label: 'IM by round', short: 'IMr' },
    { value: 'reverse-IM', label: 'Reverse IM', short: 'RIM' },
    { value: 'mixed', label: 'Mixed', short: 'Mix' }
  ];

  const equipment = [
    { value: 'none', label: 'No Equipment' },
    { value: 'kickboard', label: 'Kickboard' },
    { value: 'pullbuoy', label: 'Pull Buoy' },
    { value: 'fins', label: 'Fins' },
    { value: 'paddles', label: 'Paddles' },
    { value: 'snorkel', label: 'Snorkel' }
  ];

  useEffect(() => {
    const mockWorkout = {
      name: "Complex Training Session",
      items: [
        {
          id: "w1",
          type: "step",
          stepType: "warmup",
          distance: 400,
          stroke: "freestyle",
          effort: "easy",
          intensityTarget: "effort-base",
          equipment: ["none"],
          notes: "Înot relaxat pentru încălzire"
        },
        {
          id: "w2",
          type: "repeat",
          stepType: "main",
          repeats: 3,
          notes: "Serii principale mixte",
          items: [
            {
              id: "m1",
              type: "step",
              stepType: "main",
              distance: 100,
              stroke: "butterfly",
              effort: "hard",
              intensityTarget: "target-pace",
              targetPace: "1:25",
              equipment: ["fins"],
              notes: "Menține ritmul constant"
            },
            {
              id: "m2",
              type: "step",
              stepType: "rest",
              rest: 30,
              notes: "Recuperare activă"
            },
            {
              id: "m3",
              type: "step",
              stepType: "main",
              distance: 200,
              stroke: "backstroke",
              drillType: "drill",
              effort: "moderate",
              intensityTarget: "css-target",
              cssTarget: "-2",
              equipment: ["pullbuoy", "paddles"],
              notes: "Axează-te pe rotația umerilor"
            }
          ]
        },
        {
          id: "w3",
          type: "step",
          stepType: "rest",
          rest: 60,
          notes: "Pauză între seturi"
        },
        {
          id: "w4",
          type: "repeat",
          stepType: "main",
          repeats: 4,
          notes: "Sprinturi freestyle",
          items: [
            {
              id: "s1",
              type: "step",
              stepType: "main",
              distance: 50,
              stroke: "freestyle",
              effort: "sprint",
              intensityTarget: "effort-base",
              equipment: ["none"],
              notes: "Explozivitate maximă"
            }
          ]
        },
        {
          id: "w5",
          type: "step",
          stepType: "cooldown",
          distance: 300,
          stroke: "choice",
          effort: "recovery",
          equipment: ["snorkel"],
          notes: "Înot ușor pentru revenire"
        }
      ]
    };
  
    setWorkout(mockWorkout);
    setIsLoading(false);
  }, []);

  const calculateDistance = (items) => {
    return items.reduce((total, item) => {
      if (item.type === 'repeat') {
        const repeatDistance = item.items ? calculateDistance(item.items) : 0;
        return total + (repeatDistance * (item.repeats || 1));
      }
      return item.stepType !== 'rest' ? total + (item.distance || 0) : total;
    }, 0);
  };

  const generateNotation = (items) => {
    return items.map(item => {
      if (item.type === 'repeat' && item.items) {
        const inner = generateNotation(item.items).join(' + ');
        return `${item.repeats}x{${inner}}`;
      }
      if (item.stepType === 'rest') {
        return item.rest ? `${item.rest}s Rest` : 'Rest';
      }
      const strokeShort = strokeTypes.find(s => s.value === item.stroke)?.short || '';
      return `${item.distance}${strokeShort}`;
    }).filter(Boolean);
  };

  const generateItemHTML = (item, itemNumber = null) => {
    if (item.type === 'repeat') {
      const childrenHTML = (item.items || item.childItems || [])
        .map((subItem, idx) => `
          <div style="margin-left: 20px; padding: 8px 12px; background: white; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 6px;">
            ${generateItemHTML(subItem)}
          </div>
        `).join('');
      
      return `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
            <span style="background: #dc2626; color: white; padding: 4px 12px; border-radius: 4px; font-weight: 700; font-size: 16px;">${item.repeats}×</span>
            <span style="font-weight: 600; color: #dc2626; text-transform: uppercase; font-size: 14px;">REPEAT</span>
            ${item.notes ? `<span style="font-style: italic; color: #666; font-size: 14px;">(${item.notes})</span>` : ''}
          </div>
          <div style="border-left: 3px solid #dc2626; padding-left: 12px; margin-left: 12px;">
            ${childrenHTML}
          </div>
        </div>
      `;
    }
    
    if (item.stepType === 'rest') {
      return `
        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f3e8ff; border-radius: 4px; border: 1px solid #a78bfa;">
          <span style="font-size: 20px;">⏸</span>
          <span style="font-weight: 600; color: #6b21a8; font-size: 16px;">
            ${item.rest ? `${item.rest}s Rest` : 'Rest'}
          </span>
          ${item.notes ? `<span style="font-style: italic; color: #7c3aed; font-size: 14px;">— ${item.notes}</span>` : ''}
        </div>
      `;
    }
    
    const strokeLabel = strokeTypes.find(s => s.value === item.stroke?.toLowerCase())?.label || item.stroke;
    let intensityText = '';
    
    if (item.intensityTarget === 'target-pace' && item.targetPace) {
      intensityText = `@ ${item.targetPace}/100m`;
    } else if (item.intensityTarget === 'css-target' && item.cssTarget) {
      intensityText = `@ CSS ${parseInt(item.cssTarget) > 0 ? '+' : ''}${item.cssTarget}s`;
    } else if (item.intensityTarget === 'effort-base' && item.effort) {
      intensityText = `— ${item.effort}`;
    }
    
    const equipmentText = item.equipment && !item.equipment.includes('none') && item.equipment.length > 0
      ? Array.isArray(item.equipment)
        ? item.equipment.map(eq => equipment.find(e => e.value === eq)?.label || eq).join(', ')
        : equipment.find(e => e.value === item.equipment)?.label || item.equipment
      : '';
    
    return `
      <div>
        <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 6px;">
          <span style="font-size: 22px; font-weight: 700; color: #2563eb;">${item.distance}m</span>
          <span style="font-size: 18px; font-weight: 600;">${strokeLabel}</span>
          ${item.drillType && item.drillType !== 'none' ? `<span style="font-style: italic; color: #7c2d12; font-size: 14px;">(${item.drillType})</span>` : ''}
          ${intensityText ? `<span style="color: #7c3aed; font-weight: 600; font-size: 14px;">${intensityText}</span>` : ''}
        </div>
        ${equipmentText ? `<div style="display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; border: 1px solid #fbbf24; margin-bottom: 6px;">${equipmentText}</div>` : ''}
        ${item.notes ? `<div style="font-style: italic; color: #4b5563; font-size: 14px; padding-left: 12px; border-left: 3px solid #10b981; margin-top: 6px;">${item.notes}</div>` : ''}
      </div>
    `;
  };

  const handlePrintWorkout = () => {
    const totalDistance = calculateDistance(workout.items);
    const notation = generateNotation(workout.items);
    
    const workoutItemsHTML = workout.items.map((item, index) => `
      <div style="display: grid; grid-template-columns: 40px 1fr; gap: 12px; padding: 12px; border: 1.5px solid #d1d5db; border-radius: 6px; background: #fafafa; margin-bottom: 10px; page-break-inside: avoid;">
        <div style="width: 40px; height: 40px; background: #000; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0;">${index + 1}</div>
        <div style="flex: 1; min-width: 0;">
          ${generateItemHTML(item, index + 1)}
        </div>
      </div>
    `).join('');

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${workout.name} - Workout</title>
        <style>
          @page {
            margin: 1.5cm;
            size: A4;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #1a1a1a;
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #000;
          }
          
          .header h1 {
            font-size: 22pt;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          
          .header .meta {
            font-size: 12pt;
            color: #333;
          }
          
          .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 2px solid #000;
            page-break-inside: avoid;
          }
          
          .notation {
            font-size: 11pt;
            line-height: 1.6;
            background: #f9fafb;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            word-break: break-word;
          }
          
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${workout.name}</h1>
          <div class="meta">Total: ${totalDistance}m | Sets: ${workout.items.length}</div>
        </div>
        
        <div class="content">
          ${workoutItemsHTML}
        </div>
        
        <div class="footer">
          <div class="notation">
            <strong>Notation:</strong> ${notation.join(' + ')}
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  const renderWhiteboardItem = (item) => {
    if (item.type === 'repeat') {
      return (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ background: '#dc2626', color: 'white', padding: '4px 12px', borderRadius: '4px', fontWeight: '700', fontSize: '16px' }}>{item.repeats}×</span>
            <span style={{ fontWeight: '600', color: '#dc2626', textTransform: 'uppercase', fontSize: '14px' }}>Repeat</span>
            {item.notes && <span style={{ fontStyle: 'italic', color: '#666', fontSize: '14px' }}>({item.notes})</span>}
          </div>
          <div style={{ borderLeft: '3px solid #dc2626', paddingLeft: '12px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(item.items || item.childItems || []).map((subItem, idx) => (
              <div key={subItem.id || idx} style={{ padding: '10px', background: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                {renderWhiteboardItem(subItem)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (item.stepType === 'rest') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f3e8ff', borderRadius: '4px', border: '1px solid #a78bfa' }}>
          <span style={{ fontSize: '20px' }}>⏸</span>
          <span style={{ fontWeight: '600', color: '#6b21a8', fontSize: '16px' }}>
            {item.rest ? `${item.rest}s Rest` : 'Rest'}
          </span>
          {item.notes && <span style={{ fontStyle: 'italic', color: '#7c3aed', fontSize: '14px' }}>— {item.notes}</span>}
        </div>
      );
    }

    const strokeLabel = strokeTypes.find(s => s.value === item.stroke?.toLowerCase())?.label || item.stroke;
    
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#2563eb' }}>{item.distance}m</span>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>{strokeLabel}</span>
          
          {item.drillType && item.drillType !== 'none' && (
            <span style={{ fontStyle: 'italic', color: '#7c2d12', fontSize: '14px' }}>({item.drillType})</span>
          )}
          
          {item.intensityTarget === 'target-pace' && item.targetPace && (
            <span style={{ color: '#7c3aed', fontWeight: '600', fontSize: '14px' }}>@ {item.targetPace}/100m</span>
          )}
          
          {item.intensityTarget === 'css-target' && item.cssTarget && (
            <span style={{ color: '#7c3aed', fontWeight: '600', fontSize: '14px' }}>
              @ CSS {parseInt(item.cssTarget) > 0 ? '+' : ''}{item.cssTarget}s
            </span>
          )}
          
          {item.intensityTarget === 'effort-base' && item.effort && (
            <span style={{ color: '#7c3aed', fontWeight: '600', fontSize: '14px' }}>— {item.effort}</span>
          )}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {item.equipment && !item.equipment.includes('none') && item.equipment.length > 0 && (
            <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', border: '1px solid #fbbf24' }}>
              {Array.isArray(item.equipment) 
                ? item.equipment.map(eq => equipment.find(e => e.value === eq)?.label || eq).join(', ')
                : equipment.find(e => e.value === item.equipment)?.label || item.equipment
              }
            </span>
          )}
          
          {item.notes && (
            <div style={{ fontStyle: 'italic', color: '#4b5563', fontSize: '14px', paddingLeft: '12px', borderLeft: '3px solid #10b981', marginTop: '6px', width: '100%' }}>{item.notes}</div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', background: 'white', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', fontSize: '1.2rem', color: '#6b7280' }}>
          Loading workout...
        </div>
      </div>
    );
  }

  const totalDistance = calculateDistance(workout.items);
  const notation = generateNotation(workout.items);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', background: 'white', color: '#1a1a1a', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #000', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{workout.name}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1rem', color: '#666', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#000' }}>Total:</span>
              <span>{totalDistance}m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#000' }}>Sets:</span>
              <span>{workout.items.length}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handlePrintWorkout}
            style={{ padding: '0.75rem 1.25rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.9rem', border: 'none', cursor: 'pointer', background: '#2563eb', color: 'white', fontFamily: 'Arial, sans-serif' }}
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {workout.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', fontSize: '1.2rem', color: '#6b7280' }}>
            No workout items
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workout.items.map((item, index) => (
              <div key={item.id || index} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '12px', padding: '12px', border: '1.5px solid #d1d5db', borderRadius: '6px', background: '#fafafa', transition: 'all 0.2s ease' }}>
                <div style={{ width: '40px', height: '40px', background: '#000', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0, fontFamily: 'Arial, sans-serif' }}>{index + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {renderWhiteboardItem(item)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #000' }}>
        <div style={{ fontSize: '1rem', lineHeight: '1.6', background: '#f9fafb', padding: '1rem', borderRadius: '6px', border: '1px solid #d1d5db', wordBreak: 'break-word' }}>
          <strong style={{ fontFamily: 'Arial, sans-serif' }}>Notation:</strong> {notation.join(' + ')}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPreview;