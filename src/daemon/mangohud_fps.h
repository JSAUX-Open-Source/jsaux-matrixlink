#pragma once
#include <QCoreApplication>
#include <QDateTime>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QJsonDocument>
#include <QJsonObject>
#include <QProcess>
#include <QProcessEnvironment>
#include <QTimer>
#include <functional>
#include <unistd.h>
namespace jsaux_fps {
class MangoHudFps final : public QObject {
public:
  MangoHudFps(QObject *parent,std::function<QJsonObject()> context):QObject(parent),context_(std::move(context)) {
    explicit_=!qEnvironmentVariable("JSAUX_MATRIX_MANGOAPP_SAMPLE_PATH").isEmpty() ||
      !qEnvironmentVariable("JSAUX_MATRIX_GAMESCOPE_STATS_PATH").isEmpty() ||
      !qEnvironmentVariable("JSAUX_MATRIX_MANGOHUD_LOG_PATH").isEmpty();
    const auto runtime=qEnvironmentVariable("XDG_RUNTIME_DIR");
    statePath_=qEnvironmentVariable("JSAUX_GAME_FPS_STATE",runtime+"/jsaux-pixel-fps/state.json");
    blankPath_=runtime+"/jsaux-pixel-fps/disabled.sample";
    if(!explicit_ && !runtime.isEmpty()) {
      QDir().mkpath(QFileInfo(blankPath_).absolutePath());QFile blank(blankPath_);
      if(blank.open(QIODevice::WriteOnly))blank.close();
      if(qEnvironmentVariable("JSAUX_GAME_FPS_NO_HELPER")!="1") {
        const auto script=QDir::homePath()+"/.local/lib/jsaux-matrixlink/refresh/jsaux_game_fps.py";
        if(QFileInfo::exists(script)) {
          helper_=new QProcess(this);
          auto env=QProcessEnvironment::systemEnvironment();env.remove("LD_PRELOAD");helper_->setProcessEnvironment(env);
          helper_->setProcessChannelMode(QProcess::ForwardedErrorChannel);
          helper_->setStandardOutputFile(QProcess::nullDevice());
          helper_->start("/usr/bin/python3",{script,"--parent",QString::number(::getpid()),"--state",statePath_,
            "--log-dir",qEnvironmentVariable("JSAUX_MATRIX_MANGOHUD_LOG_DIR",QDir::homePath()+"/.local/lib/jsaux-matrixlink/logs/mangohud")});
        }
      }
    }
    auto timer=new QTimer(this);timer->setInterval(100);
    connect(timer,&QTimer::timeout,this,[this]{tick();});timer->start();
    connect(qApp,&QCoreApplication::aboutToQuit,this,[this]{stop();});
  }
  ~MangoHudFps() override {stop();}
  bool prefersGameCsv()const {return managed_;}
  QJsonObject status()const {auto out=state_;out["enabled"]=!explicit_;out["originalV12DesktopSampler"]=true;return out;}
private:
  void release(){
    if(!managed_)return;
    if(qEnvironmentVariable("JSAUX_MATRIX_MANGOAPP_SAMPLE_PATH")==blankPath_)qunsetenv("JSAUX_MATRIX_MANGOAPP_SAMPLE_PATH");
    if(qEnvironmentVariable("JSAUX_MATRIX_GAMESCOPE_STATS_PATH")==blankPath_)qunsetenv("JSAUX_MATRIX_GAMESCOPE_STATS_PATH");
    if(qEnvironmentVariable("JSAUX_MATRIX_MANGOHUD_LOG_PATH")==csvPath_)qunsetenv("JSAUX_MATRIX_MANGOHUD_LOG_PATH");
    managed_=false;csvPath_.clear();
  }
  void stop(){release();if(helper_ && helper_->state()!=QProcess::NotRunning){helper_->terminate();helper_->waitForFinished(1500);}}
  void tick(){
    if(explicit_){state_={{"state","existing-source"}};return;}
    QFile f(statePath_);QJsonObject data;
    if(f.open(QIODevice::ReadOnly))data=QJsonDocument::fromJson(f.readAll()).object();
    const auto ctx=context_();const auto path=data.value("csvPath").toString();const QFileInfo csv(path);
    const auto age=QDateTime::currentMSecsSinceEpoch()-csv.lastModified().toMSecsSinceEpoch();
    const auto root=QDir(qEnvironmentVariable("JSAUX_MATRIX_MANGOHUD_LOG_DIR",QDir::homePath()+"/.local/lib/jsaux-matrixlink/logs/mangohud")).canonicalPath();
    const bool valid=data.value("gaming").toBool() && ctx.value("running").toBool() &&
      data.value("appId")==ctx.value("appId") && !path.isEmpty() && csv.isFile() && age>=0 && age<2000 &&
      !root.isEmpty() && csv.canonicalFilePath().startsWith(root+"/") &&
      QDateTime::currentMSecsSinceEpoch()-QFileInfo(statePath_).lastModified().toMSecsSinceEpoch()<2000;
    const bool configured=data.value("gaming").toBool() && data.value("configured").toBool() && ctx.value("running").toBool() && data.value("appId")==ctx.value("appId");
    if(valid || configured) {
      // Use the original V1.2 CSV parser and its normal 100 ms/2 s timing.
      // Suppress compositor timing only while fresh application CSV is available.
      qputenv("JSAUX_MATRIX_MANGOAPP_SAMPLE_PATH",QFile::encodeName(blankPath_));
      qputenv("JSAUX_MATRIX_GAMESCOPE_STATS_PATH",QFile::encodeName(blankPath_));
      const auto chosen=valid?path:blankPath_;
      qputenv("JSAUX_MATRIX_MANGOHUD_LOG_PATH",QFile::encodeName(chosen));
      csvPath_=chosen;managed_=true;
    } else release();
    state_=data;state_["csvSelected"]=valid;
    if(data.isEmpty())state_["state"]="waiting-for-helper";
  }
  std::function<QJsonObject()> context_;QProcess *helper_=nullptr;
  QString statePath_,blankPath_,csvPath_;QJsonObject state_;
  bool explicit_=false,managed_=false;
};
}
