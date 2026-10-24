#include "refresh_policy.h"
#include "render_policy.h"
#include <QCoreApplication>
#include <QCryptographicHash>
#include <cstdio>
#include <cstdlib>
using namespace jsaux_refresh;
int checks=0;
void check(bool value,const char *message){++checks;if(!value){std::fprintf(stderr,"FAIL %s\n",message);std::exit(1);}}
QByteArray pixels(const QImage &image){
  QByteArray bytes;
  for(int y=0;y<image.height();++y)for(int x=0;x<image.width();++x){const auto p=image.pixel(x,y);bytes.append(reinterpret_cast<const char *>(&p),4);}
  return bytes;
}
int main(int argc,char **argv){
  QCoreApplication app(argc,argv);
  for(const auto &module:{QStringLiteral("dashboard"),QStringLiteral("system_performance")}) {
    Policy p;Snapshot s;s.module=module;s.minute=10;s.percent={{"cpu",40},{"gpu",20},{"ram",60}};s.fpsValue="60";
    check(!p.reason(s).isEmpty(),"first display");p.success(s);
    auto raw=s;raw.percent["cpu"]=41;
    auto off=p.prepare(raw,false);check(off.percent.value("cpu")==41,"default off keeps V1.2 values");check(!p.reason(off).isEmpty(),"off one point triggers");
    for(int cpu:{34,35,40,45,46}){raw.percent["cpu"]=cpu;auto shown=p.prepare(raw,true);check(shown.percent.value("cpu")==40,"inclusive six point hold");check(p.reason(shown).isEmpty(),"no upload inside threshold");}
    raw.percent["cpu"]=47;auto shown=p.prepare(raw,true);check(shown.percent.value("cpu")==47,"over six triggers");check(!p.reason(shown).isEmpty(),"threshold upload");
    // A failed upload must not advance the per-metric baseline.
    raw.percent["cpu"]=46;check(p.prepare(raw,true).percent.value("cpu")==40,"failed upload keeps old baseline");
    raw=s;raw.percent["cpu"]=45;raw.percent["gpu"]=27;raw.percent["ram"]=65;raw.fpsValue="61";
    shown=p.prepare(raw,true);check(shown.percent.value("gpu")==27,"GPU independently changes");
    check(shown.percent.value("cpu")==40 && shown.percent.value("ram")==60,"FPS cannot release other held values");
    check(!p.reason(shown).isEmpty(),"single FPS change refreshes");p.success(shown);
    raw.fpsValue="60";raw.percent["cpu"]=46;shown=p.prepare(raw,true);check(shown.percent.value("cpu")==40,"FPS commits do not move CPU baseline");
    check(shown.percent.value("gpu")==27,"GPU baseline retained");check(!p.reason(shown).isEmpty(),"reverse FPS change refreshes");
    raw.fpsValue="--";check(!p.reason(p.prepare(raw,true)).isEmpty(),"FPS unavailable transition");
    raw.percent.remove("ram");check(!p.prepare(raw,true).percent.contains("ram"),"unknown metrics remain unknown");
    p.success(s);raw=s;raw.minute=11;shown=p.prepare(raw,true);
    check((!p.reason(shown).isEmpty())==(module=="dashboard"),"only dashboard has minute refresh");
    raw.presentation["doNotDisturb"]=false;check(p.prepare(raw,true).percent==raw.percent,"setting change establishes fresh values");
    p.invalidate();check(!p.reason(s).isEmpty(),"reconnect forces display");
    QImage previous(64,54,QImage::Format_RGB888),next(64,54,QImage::Format_RGB888);previous.fill(QColor(5,15,25));next.fill(QColor(50,60,70));
    const auto fpsRect=module=="dashboard"?QRect(34,43,30,11):QRect(0,2,64,7);
    const auto beforeFps=pixels(next.copy(fpsRect));
    holdMetricRegions(next,previous,module,{{"cpu",45},{"gpu",27},{"ram",65}},{{"cpu",40},{"gpu",27},{"ram",60}});
    check(pixels(next.copy(metricRegion(module,"cpu")))==pixels(previous.copy(metricRegion(module,"cpu"))),"CPU number and bar held");
    check(pixels(next.copy(metricRegion(module,"ram")))==pixels(previous.copy(metricRegion(module,"ram"))),"RAM number and bar held");
    check(next.pixelColor(metricRegion(module,"gpu").center())==QColor(50,60,70),"GPU is fresh");
    check(pixels(next.copy(fpsRect))==beforeFps,"FPS pixels unchanged by DND");
  }
  QImage rail(64,54,QImage::Format_RGB888);rail.fill(Qt::black);
  for(int x=0;x<64;++x){rail.setPixelColor(x,20,QColor(102,102,102));rail.setPixelColor(x,22,QColor(102,102,102));}
  rail.setPixelColor(17,21,Qt::red);const auto border=pixels(rail.copy(QRect(0,20,64,1)));
  for(int minute=0;minute<60;++minute){auto image=rail;drawMinuteRail(image,minute);int count=0;
    for(int x=2;x<=61;++x)if(image.pixelColor(x,21).red()>180)++count;
    check(count==minute+1,"minute rail has 1..60 red dots");check(pixels(image.copy(QRect(0,20,64,1)))==border,"gray border retained");
  }
  QImage clock(64,54,QImage::Format_RGB888);clock.fill(QColor(3,7,11));
  for(int x=2;x<=61;++x){clock.setPixelColor(x,47,QColor(102,102,102));clock.setPixelColor(x,50,QColor(102,102,102));}
  for(int y:{48,49})clock.setPixelColor(17,y,QColor(248,0,0));
  for(int minute=0;minute<60;++minute){auto image=clock;drawClockMinuteRail(image,minute);
    bool outsideSame=true,insideCorrect=true;
    for(int y=0;y<54;++y)for(int x=0;x<64;++x){
      if(x>=2 && x<=61 && y>=48 && y<=49)
        insideCorrect&=image.pixelColor(x,y)==(x<3+minute?QColor(248,0,0):QColor(3,7,11));
      else outsideSame&=image.pixel(x,y)==clock.pixel(x,y);
    }
    check(insideCorrect,"clock red rail is cumulative 1..60 in both rows");
    check(outsideSame,"clock glyphs and gray scale remain unchanged");
    auto repeated=image;drawClockMinuteRail(repeated,minute);
    check(pixels(repeated)==pixels(image),"clock same-minute redraw is stable");
  }
  auto rollover=clock;drawClockMinuteRail(rollover,59);drawClockMinuteRail(rollover,0);
  auto first=clock;drawClockMinuteRail(first,0);
  check(pixels(rollover)==pixels(first),"clock hour rollover clears all previous red cells");
  Policy clockPolicy;Snapshot clockState;clockState.module="productivity";clockState.minute=59;
  clockPolicy.success(clockState);check(clockPolicy.reason(clockState).isEmpty(),"clock suppressed inside same minute");
  clockState.minute=60;check(!clockPolicy.reason(clockState).isEmpty(),"clock next minute updates");
  clockPolicy.invalidate();check(!clockPolicy.reason(clockState).isEmpty(),"clock reconnect recovers current minute");
  std::printf("PASS: %d contract checks\n",checks);
}
