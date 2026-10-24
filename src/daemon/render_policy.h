#pragma once
#include <QImage>
#include <QPainter>
#include <QJsonObject>

namespace jsaux_refresh {
inline void drawMinuteRailRows(QImage &image,int minute,int top,int height) {
  if(image.size()!=QSize(64,54))return;
  QColor background=image.pixelColor(0,top),red(255,0,0);
  int lowest=background.red()+background.green()+background.blue();
  for(int x=2;x<=61;++x) {
    const QColor c=image.pixelColor(x,top);
    const int sum=c.red()+c.green()+c.blue();
    if(sum<lowest){lowest=sum;background=c;}
    if(c.red()>180 && c.green()<80 && c.blue()<80)red=c;
  }
  for(int y=top;y<top+height;++y)
    for(int x=2;x<=61;++x)image.setPixelColor(x,y,x<3+qBound(0,minute,59)?red:background);
}
inline void drawMinuteRail(QImage &image,int minute) {drawMinuteRailRows(image,minute,21,1);}
inline void drawClockMinuteRail(QImage &image,int minute) {drawMinuteRailRows(image,minute,48,2);}
inline QRect metricRegion(const QString &module,const QString &key) {
  if(module=="dashboard") {
    if(key=="gpu")return QRect(0,28,30,11);
    if(key=="cpu")return QRect(34,28,30,11);
    return QRect(0,43,30,11);
  }
  if(key=="gpu")return QRect(0,11,64,13);
  if(key=="cpu")return QRect(0,25,64,13);
  return QRect(0,39,64,13);
}
inline void holdMetricRegions(QImage &image,const QImage &last,const QString &module,
                              const QJsonObject &raw,const QJsonObject &shown) {
  if(image.size()!=QSize(64,54) || last.size()!=image.size())return;
  QPainter painter(&image);
  for(const auto &key:{QStringLiteral("cpu"),QStringLiteral("gpu"),QStringLiteral("ram")}) {
    if(raw.value(key)!=shown.value(key)) {
      const auto box=metricRegion(module,key);
      painter.drawImage(box,last,box);
    }
  }
}
}
