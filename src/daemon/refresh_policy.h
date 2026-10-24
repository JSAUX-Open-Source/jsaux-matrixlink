#pragma once
#include <QJsonObject>
#include <QString>
#include <cmath>
#include <optional>

namespace jsaux_refresh {
struct Snapshot {
  QString module;
  qint64 minute=0;
  QJsonObject presentation,percent;
  QJsonValue fpsValue;
};
inline bool controlled(const QString &m) {
  return m=="productivity" || m=="dashboard" || m=="system_performance";
}
class Policy {
public:
  Snapshot prepare(const Snapshot &raw,bool doNotDisturb) const {
    Snapshot shown=raw;
    if(!doNotDisturb || !last_ || last_->module!=raw.module || last_->presentation!=raw.presentation)
      return shown;
    for(const auto &key:{QStringLiteral("cpu"),QStringLiteral("gpu"),QStringLiteral("ram")}) {
      auto a=last_->percent.value(key),b=raw.percent.value(key);
      if(a.isDouble() && b.isDouble() && std::abs(a.toDouble()-b.toDouble())<=6.0)
        shown.percent[key]=a;
    }
    return shown;
  }
  QString reason(const Snapshot &s) const {
    if(!controlled(s.module))return "passthrough";
    if(!last_)return "first-display";
    if(last_->module!=s.module)return "module-change";
    if(last_->presentation!=s.presentation)return "presentation-change";
    if(s.module!="system_performance" && last_->minute!=s.minute)return "minute-change";
    if(s.module=="productivity")return {};
    for(const auto &key:{QStringLiteral("cpu"),QStringLiteral("gpu"),QStringLiteral("ram")})
      if(last_->percent.value(key)!=s.percent.value(key))return key+"-change";
    if(last_->fpsValue!=s.fpsValue)return "fps-change-v12";
    return {};
  }
  void success(const Snapshot &s){if(controlled(s.module))last_=s;else last_.reset();}
  void invalidate(){last_.reset();}
  const std::optional<Snapshot> &last()const{return last_;}
private:
  std::optional<Snapshot> last_;
};
}
