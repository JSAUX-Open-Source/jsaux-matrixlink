#!/usr/bin/env bash

# The installer is intentionally self-contained and does not depend on a
# locale package being installed on SteamOS.  We use the machine's locale only
# to select one of the bundled UTF-8 message sets.

jsaux_language_from_token() {
  local token="${1:-}"
  token="${token%%:*}"
  token="${token%%.*}"
  token="${token%%@*}"
  token="${token//-/_}"
  case "$token" in
    [zZ][hH]|[zZ][hH]_*) printf '%s' zh ;;
    [jJ][aA]|[jJ][aA]_*) printf '%s' ja ;;
    [kK][oO]|[kK][oO]_*) printf '%s' ko ;;
    [dD][eE]|[dD][eE]_*) printf '%s' de ;;
    [eE][nN]|[eE][nN]_*) printf '%s' en ;;
    *) return 1 ;;
  esac
}

jsaux_detect_ui_language() {
  local variable raw token selected normalized
  # LC_ALL/LC_MESSAGES are the most specific settings.  Unsupported values
  # such as C.UTF-8 are skipped so LANG=ja_JP.UTF-8 still works in a shell
  # started with LC_ALL=C.UTF-8.
  for variable in LC_ALL LC_MESSAGES LANGUAGE LANG; do
    raw="${!variable-}"
    [[ -n "$raw" ]] || continue
    while :; do
      token="${raw%%:*}"
      if [[ "$raw" == *:* ]]; then
        raw="${raw#*:}"
      else
        raw=""
      fi
      if selected="$(jsaux_language_from_token "$token")"; then
        printf '%s' "$selected"
        return 0
      fi
      normalized="${token%%.*}"
      normalized="${normalized%%@*}"
      normalized="${normalized%%_*}"
      # C/POSIX are shell defaults rather than a user-facing language.  Keep
      # looking for LANG in that case; an explicitly unsupported locale falls
      # back to English instead of silently using a lower-priority locale.
      case "$normalized" in
        [cC]|[pP][oO][sS][iI][xX]|'') ;;
        *) printf '%s' en; return 0 ;;
      esac
      [[ -n "$raw" ]] || break
    done
  done
  printf '%s' en
}

jsaux_init_ui_language() {
  local selected
  if selected="$(jsaux_language_from_token "${JSAUX_UI_LANGUAGE:-}")"; then
    :
  else
    selected="$(jsaux_detect_ui_language)"
  fi
  JSAUX_UI_LANGUAGE="$selected"
  export JSAUX_UI_LANGUAGE
}

# Values are printf formats.  Keeping the catalog here means the installed
# uninstaller can show the same language even after the package directory has
# been removed.

  # Chinese
JSAUX_UI_zh_installer_title='JSAUX PIXEL Steam Machine 安装程序'
JSAUX_UI_zh_install_log='安装日志：%s'
JSAUX_UI_zh_install_success_short='插件源码已安装（非完整产品）。'
JSAUX_UI_zh_install_success_dialog=$'开源 tip：仅安装了 Decky 插件源码。\n\n未安装闭源伴生（daemon/Studio）。无官方闭源伴生时，插件核心显示功能不可用。'
JSAUX_UI_zh_install_failure_short='安装失败（错误代码：%s）。'
JSAUX_UI_zh_install_failure_dialog=$'JSAUX PIXEL 安装失败。\n\n请保留桌面上的安装日志。\n日志：%s'
JSAUX_UI_zh_install_keep_log='请保留此窗口和日志文件。'
JSAUX_UI_zh_install_log_delete_warning='警告：无法删除安装日志：%s'
JSAUX_UI_zh_close_prompt='按回车键关闭窗口。'
JSAUX_UI_zh_uninstall_start='正在卸载 JSAUX PIXEL...'
JSAUX_UI_zh_admin_required='需要管理员权限。请运行：sudo %s'
JSAUX_UI_zh_uninstall_success_dialog=$'JSAUX PIXEL 卸载完成。\n\n桌面模式、Decky 游戏模式及相关设置、数据、日志、缓存和备份均已删除。'
JSAUX_UI_zh_uninstall_done_short='卸载完成。'
JSAUX_UI_zh_uninstall_failure_short='卸载失败（错误代码：%s）。'
JSAUX_UI_zh_uninstall_failure_dialog=$'JSAUX PIXEL 卸载失败。\n\n软件文件未确认全部删除，请重新运行卸载程序。\n错误代码：%s'
JSAUX_UI_zh_target_home_missing='目标用户不存在或没有主目录：%s'
JSAUX_UI_zh_target_user_missing='目标用户不存在：%s'
JSAUX_UI_zh_unsafe_home='拒绝从不安全的目标主目录卸载：%s'
JSAUX_UI_zh_uninstall_stop='正在停止 JSAUX PIXEL 服务...'
JSAUX_UI_zh_uninstall_remove='正在删除 JSAUX PIXEL 文件和数据...'
JSAUX_UI_zh_uninstall_refresh='正在刷新应用菜单...'
JSAUX_UI_zh_uninstall_done='已卸载 JSAUX PIXEL，并删除所有设置、数据、日志、缓存和备份。'
JSAUX_UI_zh_required_file_missing='安装包文件缺失：%s'
JSAUX_UI_zh_runtime_file_missing='运行依赖缺失（开源 tip 通常无闭源运行库）：%s'
JSAUX_UI_zh_ai_agent_verify='==> 正在检查 AI Agent 模块（可选）'
JSAUX_UI_zh_ai_agent_verify_failed='AI Agent 模块检查失败（可忽略；本 tip 不含登录组件）。'
JSAUX_UI_zh_linux_only='只能安装到 SteamOS/Linux。'
JSAUX_UI_zh_x86_only='需要 x86_64 Steam Machine。'
JSAUX_UI_zh_command_missing='系统命令缺失：%s'
JSAUX_UI_zh_sha_missing='无法校验离线包：缺少 sha256sum。'
JSAUX_UI_zh_sums_missing='安装包校验清单缺失：%s'
JSAUX_UI_zh_verify_start='==> 正在检查安装包（开源 tip 可选）'
JSAUX_UI_zh_verify_failed='安装包校验失败，请重新解压 ZIP。'
JSAUX_UI_zh_decky_missing='未检测到 Decky Loader。请先安装 Decky Loader，再双击本安装器。'
JSAUX_UI_zh_auth_missing='无法请求管理员授权：系统没有 pkexec 或 sudo。'
JSAUX_UI_zh_elevate_password_locked='无法获取管理员授权：该账户尚未设置密码。请在 Konsole 中运行 passwd 设置密码，然后重新运行安装程序。'
JSAUX_UI_zh_diag_title='==> 自动诊断 JSAUX PIXEL 服务'
JSAUX_UI_zh_backup_start='==> 正在备份已安装版本'
JSAUX_UI_zh_stop_previous='==> 正在停止旧版本'
JSAUX_UI_zh_native_install='==> 正在安装桌面程序和服务'
JSAUX_UI_zh_decky_install='==> 正在安装已校验的 Decky 运行包'
JSAUX_UI_zh_start_service='==> 正在启动 JSAUX PIXEL'
JSAUX_UI_zh_verify_services='==> 正在校验已安装服务'
JSAUX_UI_zh_daemon_health_failed='JSAUX PIXEL 服务健康检查失败。备份位置：%s'
JSAUX_UI_zh_service_inactive='JSAUX PIXEL 服务未处于运行状态。备份位置：%s'
JSAUX_UI_zh_loader_inactive='Decky Loader 重启失败。备份位置：%s'
JSAUX_UI_zh_installed='JSAUX PIXEL V1.2 已安装。'
JSAUX_UI_zh_backup_path='备份：%s'
JSAUX_UI_zh_desktop_app_path='桌面程序：%s'
JSAUX_UI_zh_decky_path='Decky 插件：%s'
JSAUX_UI_zh_shortcut_path='桌面快捷方式：%s'

  # Japanese
JSAUX_UI_ja_installer_title='JSAUX PIXEL Steam Machine インストーラー'
JSAUX_UI_ja_install_log='インストールログ：%s'
JSAUX_UI_ja_install_success_short='プラグインソースをインストールしました（製品全体ではありません）。'
JSAUX_UI_ja_install_success_dialog=$'オープンソース tip：Decky プラグインソースのみ。\n\nクローズド companion（daemon/Studio）は未インストール。公式クローズド companion なしではコア表示機能は動作しません。'
JSAUX_UI_ja_install_failure_short='インストールに失敗しました（コード：%s）。'
JSAUX_UI_ja_install_failure_dialog=$'JSAUX PIXEL のインストールに失敗しました。\n\nデスクトップにあるインストールログを保存してください。\nログ：%s'
JSAUX_UI_ja_install_keep_log='このウィンドウとログを保存してください。'
JSAUX_UI_ja_install_log_delete_warning='警告：インストールログを削除できません：%s'
JSAUX_UI_ja_close_prompt='Enter キーを押してウィンドウを閉じます。'
JSAUX_UI_ja_uninstall_start='JSAUX PIXEL をアンインストールしています...'
JSAUX_UI_ja_admin_required='管理者権限が必要です。次を実行してください：sudo %s'
JSAUX_UI_ja_uninstall_success_dialog=$'JSAUX PIXEL のアンインストールが完了しました。\n\nデスクトップモード、Decky ゲームモード、および関連する設定、データ、ログ、キャッシュ、バックアップを削除しました。'
JSAUX_UI_ja_uninstall_done_short='アンインストールが完了しました。'
JSAUX_UI_ja_uninstall_failure_short='アンインストールに失敗しました（コード：%s）。'
JSAUX_UI_ja_uninstall_failure_dialog=$'JSAUX PIXEL のアンインストールに失敗しました。\n\nすべてのファイルが削除されたことを確認できません。もう一度実行してください。\nエラーコード：%s'
JSAUX_UI_ja_target_home_missing='対象ユーザーが存在しないか、ホームディレクトリがありません：%s'
JSAUX_UI_ja_target_user_missing='対象ユーザーが存在しません：%s'
JSAUX_UI_ja_unsafe_home='安全でないホームディレクトリからのアンインストールを拒否しました：%s'
JSAUX_UI_ja_uninstall_stop='JSAUX PIXEL サービスを停止しています...'
JSAUX_UI_ja_uninstall_remove='JSAUX PIXEL のファイルとデータを削除しています...'
JSAUX_UI_ja_uninstall_refresh='アプリケーションメニューを更新しています...'
JSAUX_UI_ja_uninstall_done='JSAUX PIXEL をアンインストールし、設定、データ、ログ、キャッシュ、バックアップを削除しました。'
JSAUX_UI_ja_required_file_missing='インストールパッケージに必要なファイルがありません：%s'
JSAUX_UI_ja_runtime_file_missing='オフライン実行環境がありません：%s'
JSAUX_UI_ja_ai_agent_verify='==> オプションの AI Agent モジュールを確認しています'
JSAUX_UI_ja_ai_agent_verify_failed='AI Agent モジュール確認に失敗しました（無視可。この tip にログイン部品はありません）。'
JSAUX_UI_ja_linux_only='SteamOS/Linux にのみインストールできます。'
JSAUX_UI_ja_x86_only='x86_64 Steam Machine が必要です。'
JSAUX_UI_ja_command_missing='必要なシステムコマンドがありません：%s'
JSAUX_UI_ja_sha_missing='オフラインパッケージを検証できません（sha256sum がありません）。'
JSAUX_UI_ja_sums_missing='チェックサム一覧がありません：%s'
JSAUX_UI_ja_verify_start='==> オフラインパッケージを検証しています'
JSAUX_UI_ja_verify_failed='パッケージの検証に失敗しました。ZIP を再展開してください。'
JSAUX_UI_ja_decky_missing='Decky Loader が見つかりません。先に Decky Loader をインストールしてください。'
JSAUX_UI_ja_auth_missing='管理者認証を要求できません（pkexec と sudo がありません）。'
JSAUX_UI_ja_elevate_password_locked='管理者認証を取得できません：このアカウントにはパスワードが設定されていません。Konsole で passwd を実行してパスワードを設定し、再度インストールしてください。'
JSAUX_UI_ja_diag_title='==> JSAUX PIXEL サービスを診断しています'
JSAUX_UI_ja_backup_start='==> インストール済みバージョンをバックアップしています'
JSAUX_UI_ja_stop_previous='==> 以前のバージョンを停止しています'
JSAUX_UI_ja_native_install='==> デスクトップアプリとサービスをインストールしています'
JSAUX_UI_ja_decky_install='==> 検証済み Decky 実行パッケージをインストールしています'
JSAUX_UI_ja_start_service='==> JSAUX PIXEL を起動しています'
JSAUX_UI_ja_verify_services='==> インストール済みサービスを確認しています'
JSAUX_UI_ja_daemon_health_failed='JSAUX PIXEL サービスのヘルスチェックに失敗しました。バックアップ：%s'
JSAUX_UI_ja_service_inactive='JSAUX PIXEL サービスが起動していません。バックアップ：%s'
JSAUX_UI_ja_loader_inactive='Decky Loader の再起動に失敗しました。バックアップ：%s'
JSAUX_UI_ja_installed='JSAUX PIXEL V1.2 をインストールしました。'
JSAUX_UI_ja_backup_path='バックアップ：%s'
JSAUX_UI_ja_desktop_app_path='デスクトップアプリ：%s'
JSAUX_UI_ja_decky_path='Decky プラグイン：%s'
JSAUX_UI_ja_shortcut_path='デスクトップショートカット：%s'

  # Korean
JSAUX_UI_ko_installer_title='JSAUX PIXEL Steam Machine 설치 프로그램'
JSAUX_UI_ko_install_log='설치 로그: %s'
JSAUX_UI_ko_install_success_short='플러그인 소스 설치됨 (전체 제품 아님).'
JSAUX_UI_ko_install_success_dialog=$'오픈소스 tip: Decky 플러그인 소스만 설치됨.\n\n클로즈드 companion(daemon/Studio) 미설치. 공식 클로즈드 companion 없이 핵심 표시 기능은 동작하지 않습니다.'
JSAUX_UI_ko_install_failure_short='설치에 실패했습니다(코드: %s).'
JSAUX_UI_ko_install_failure_dialog=$'JSAUX PIXEL 설치에 실패했습니다.\n\n바탕 화면의 설치 로그를 보관하세요.\n로그: %s'
JSAUX_UI_ko_install_keep_log='이 창과 로그 파일을 보관하세요.'
JSAUX_UI_ko_install_log_delete_warning='경고: 설치 로그를 삭제할 수 없습니다: %s'
JSAUX_UI_ko_close_prompt='Enter 키를 눌러 창을 닫으세요.'
JSAUX_UI_ko_uninstall_start='JSAUX PIXEL를 제거하는 중...'
JSAUX_UI_ko_admin_required='관리자 권한이 필요합니다. 다음을 실행하세요: sudo %s'
JSAUX_UI_ko_uninstall_success_dialog=$'JSAUX PIXEL 제거가 완료되었습니다.\n\n데스크톱 모드, Decky 게임 모드 및 관련 설정, 데이터, 로그, 캐시와 백업을 삭제했습니다.'
JSAUX_UI_ko_uninstall_done_short='제거가 완료되었습니다.'
JSAUX_UI_ko_uninstall_failure_short='제거에 실패했습니다(코드: %s).'
JSAUX_UI_ko_uninstall_failure_dialog=$'JSAUX PIXEL 제거에 실패했습니다.\n\n모든 파일이 삭제되었는지 확인할 수 없습니다. 다시 실행하세요.\n오류 코드: %s'
JSAUX_UI_ko_target_home_missing='대상 사용자가 없거나 홈 디렉터리가 없습니다: %s'
JSAUX_UI_ko_target_user_missing='대상 사용자가 없습니다: %s'
JSAUX_UI_ko_unsafe_home='안전하지 않은 대상 홈 디렉터리에서는 제거할 수 없습니다: %s'
JSAUX_UI_ko_uninstall_stop='JSAUX PIXEL 서비스를 중지하는 중...'
JSAUX_UI_ko_uninstall_remove='JSAUX PIXEL 파일과 데이터를 삭제하는 중...'
JSAUX_UI_ko_uninstall_refresh='애플리케이션 메뉴를 새로 고치는 중...'
JSAUX_UI_ko_uninstall_done='JSAUX PIXEL를 제거하고 설정, 데이터, 로그, 캐시와 백업을 삭제했습니다.'
JSAUX_UI_ko_required_file_missing='설치 패키지 파일이 없습니다: %s'
JSAUX_UI_ko_runtime_file_missing='오프라인 런타임 파일이 없습니다: %s'
JSAUX_UI_ko_ai_agent_verify='==> 선택적 AI Agent 모듈 확인 중'
JSAUX_UI_ko_ai_agent_verify_failed='AI Agent 모듈 확인 실패(무시 가능; 이 tip에는 로그인 구성 요소 없음).'
JSAUX_UI_ko_linux_only='SteamOS/Linux에만 설치할 수 있습니다.'
JSAUX_UI_ko_x86_only='x86_64 Steam Machine이 필요합니다.'
JSAUX_UI_ko_command_missing='필요한 시스템 명령이 없습니다: %s'
JSAUX_UI_ko_sha_missing='오프라인 패키지를 확인할 수 없습니다(sha256sum 없음).'
JSAUX_UI_ko_sums_missing='체크섬 목록이 없습니다: %s'
JSAUX_UI_ko_verify_start='==> 오프라인 패키지를 확인하는 중'
JSAUX_UI_ko_verify_failed='패키지 확인에 실패했습니다. ZIP을 다시 압축 해제하세요.'
JSAUX_UI_ko_decky_missing='Decky Loader를 찾을 수 없습니다. 먼저 Decky Loader를 설치하세요.'
JSAUX_UI_ko_auth_missing='관리자 인증을 요청할 수 없습니다(pkexec 또는 sudo 없음).'
JSAUX_UI_ko_elevate_password_locked='관리자 인증을 가져올 수 없습니다: 이 계정에는 비밀번호가 설정되어 있지 않습니다. Konsole에서 passwd를 실행하여 비밀번호를 설정한 뒤 다시 설치해 주세요.'
JSAUX_UI_ko_diag_title='==> JSAUX PIXEL 서비스 자동 진단 중'
JSAUX_UI_ko_backup_start='==> 설치된 버전을 백업하는 중'
JSAUX_UI_ko_stop_previous='==> 이전 버전을 중지하는 중'
JSAUX_UI_ko_native_install='==> 데스크톱 앱과 서비스를 설치하는 중'
JSAUX_UI_ko_decky_install='==> 확인된 Decky 런타임 번들을 설치하는 중'
JSAUX_UI_ko_start_service='==> JSAUX PIXEL를 시작하는 중'
JSAUX_UI_ko_verify_services='==> 설치된 서비스를 확인하는 중'
JSAUX_UI_ko_daemon_health_failed='JSAUX PIXEL 서비스 상태 확인에 실패했습니다. 백업: %s'
JSAUX_UI_ko_service_inactive='JSAUX PIXEL 서비스가 실행 중이 아닙니다. 백업: %s'
JSAUX_UI_ko_loader_inactive='Decky Loader 재시작에 실패했습니다. 백업: %s'
JSAUX_UI_ko_installed='JSAUX PIXEL V1.2이 설치되었습니다.'
JSAUX_UI_ko_backup_path='백업: %s'
JSAUX_UI_ko_desktop_app_path='데스크톱 앱: %s'
JSAUX_UI_ko_decky_path='Decky 플러그인: %s'
JSAUX_UI_ko_shortcut_path='바탕 화면 바로 가기: %s'

  # German
JSAUX_UI_de_installer_title='JSAUX PIXEL Steam-Deck-Installationsprogramm'
JSAUX_UI_de_install_log='Installationsprotokoll: %s'
JSAUX_UI_de_install_success_short='Plugin-Quellen installiert (kein vollständiges Produkt).'
JSAUX_UI_de_install_success_dialog=$'Open-Source-Tip: Nur Decky-Plugin-Quellen.\n\nGeschlossenes Companion (Daemon/Studio) wurde NICHT installiert. Ohne offizielles Closed Companion funktionieren Kern-Displayfunktionen nicht.'
JSAUX_UI_de_install_failure_short='Installation fehlgeschlagen (Code: %s).'
JSAUX_UI_de_install_failure_dialog=$'Die Installation von JSAUX PIXEL ist fehlgeschlagen.\n\nBewahren Sie das Installationsprotokoll auf dem Desktop auf.\nProtokoll: %s'
JSAUX_UI_de_install_keep_log='Lassen Sie dieses Fenster und das Protokoll geöffnet bzw. erhalten.'
JSAUX_UI_de_install_log_delete_warning='Warnung: Installationsprotokoll konnte nicht gelöscht werden: %s'
JSAUX_UI_de_close_prompt='Drücken Sie die Eingabetaste, um das Fenster zu schließen.'
JSAUX_UI_de_uninstall_start='JSAUX PIXEL wird deinstalliert...'
JSAUX_UI_de_admin_required='Administratorrechte sind erforderlich. Ausführen: sudo %s'
JSAUX_UI_de_uninstall_success_dialog=$'JSAUX PIXEL wurde deinstalliert.\n\nDesktop-Modus, Decky-Spielemodus sowie zugehörige Einstellungen, Daten, Protokolle, Caches und Sicherungen wurden entfernt.'
JSAUX_UI_de_uninstall_done_short='Deinstallation abgeschlossen.'
JSAUX_UI_de_uninstall_failure_short='Deinstallation fehlgeschlagen (Code: %s).'
JSAUX_UI_de_uninstall_failure_dialog=$'Die Deinstallation von JSAUX PIXEL ist fehlgeschlagen.\n\nEs konnte nicht bestätigt werden, dass alle Dateien entfernt wurden. Bitte erneut ausführen.\nFehlercode: %s'
JSAUX_UI_de_target_home_missing='Zielbenutzer ist nicht vorhanden oder besitzt kein Home-Verzeichnis: %s'
JSAUX_UI_de_target_user_missing='Zielbenutzer ist nicht vorhanden: %s'
JSAUX_UI_de_unsafe_home='Deinstallation aus unsicherem Zielverzeichnis verweigert: %s'
JSAUX_UI_de_uninstall_stop='JSAUX PIXEL-Dienste werden angehalten...'
JSAUX_UI_de_uninstall_remove='JSAUX PIXEL-Dateien und -Daten werden entfernt...'
JSAUX_UI_de_uninstall_refresh='Anwendungsmenüs werden aktualisiert...'
JSAUX_UI_de_uninstall_done='JSAUX PIXEL wurde deinstalliert; Einstellungen, Daten, Protokolle, Caches und Sicherungen wurden entfernt.'
JSAUX_UI_de_required_file_missing='Erforderliche Installationsdatei fehlt: %s'
JSAUX_UI_de_runtime_file_missing='Datei der Offline-Laufzeitumgebung fehlt: %s'
JSAUX_UI_de_ai_agent_verify='==> Optionales AI-Agent-Modul wird geprüft'
JSAUX_UI_de_ai_agent_verify_failed='AI-Agent-Modulprüfung fehlgeschlagen (ignorierbar; dieses Tip hat keine Anmeldekomponente).'
JSAUX_UI_de_linux_only='Installation ist nur unter SteamOS/Linux möglich.'
JSAUX_UI_de_x86_only='Ein x86_64-Steam-Deck ist erforderlich.'
JSAUX_UI_de_command_missing='Erforderlicher Systembefehl fehlt: %s'
JSAUX_UI_de_sha_missing='Offline-Paket kann nicht geprüft werden (sha256sum fehlt).'
JSAUX_UI_de_sums_missing='Prüfsummenliste fehlt: %s'
JSAUX_UI_de_verify_start='==> Offline-Paket wird geprüft'
JSAUX_UI_de_verify_failed='Paketprüfung fehlgeschlagen. Bitte ZIP erneut entpacken.'
JSAUX_UI_de_decky_missing='Decky Loader wurde nicht gefunden. Bitte zuerst Decky Loader installieren.'
JSAUX_UI_de_auth_missing='Administratorauthentifizierung nicht möglich (pkexec und sudo fehlen).'
JSAUX_UI_de_elevate_password_locked='Administratorenautorisierung nicht verfügbar: Für dieses Konto ist kein Passwort festgelegt. Bitte in Konsole mit passwd ein Passwort setzen und die Installation erneut starten.'
JSAUX_UI_de_diag_title='==> Automatische Diagnose der JSAUX PIXEL-Dienste'
JSAUX_UI_de_backup_start='==> Installierte Version wird gesichert'
JSAUX_UI_de_stop_previous='==> Vorherige Version wird angehalten'
JSAUX_UI_de_native_install='==> Desktop-Anwendung und Dienst werden installiert'
JSAUX_UI_de_decky_install='==> Geprüftes Decky-Laufzeitpaket wird installiert'
JSAUX_UI_de_start_service='==> JSAUX PIXEL wird gestartet'
JSAUX_UI_de_verify_services='==> Installierte Dienste werden geprüft'
JSAUX_UI_de_daemon_health_failed='Gesundheitsprüfung des JSAUX PIXEL-Dienstes fehlgeschlagen. Sicherung: %s'
JSAUX_UI_de_service_inactive='JSAUX PIXEL-Dienst ist nicht aktiv. Sicherung: %s'
JSAUX_UI_de_loader_inactive='Neustart des Decky Loaders fehlgeschlagen. Sicherung: %s'
JSAUX_UI_de_installed='JSAUX PIXEL V1.2 wurde installiert.'
JSAUX_UI_de_backup_path='Sicherung: %s'
JSAUX_UI_de_desktop_app_path='Desktop-Anwendung: %s'
JSAUX_UI_de_decky_path='Decky-Plugin: %s'
JSAUX_UI_de_shortcut_path='Desktop-Verknüpfung: %s'

  # English fallback and explicit English locale
JSAUX_UI_en_installer_title='JSAUX PIXEL Steam Machine Installer'
JSAUX_UI_en_install_log='Install log: %s'
JSAUX_UI_en_install_success_short='Plugin sources installed (not a full product).'
JSAUX_UI_en_install_success_dialog=$'Opensource tip: Decky plugin sources only.\n\nClosed companion (daemon/Studio) was NOT installed. Without the official closed companion, core plugin display features will not work.'
JSAUX_UI_en_install_failure_short='Installation failed (code: %s).'
JSAUX_UI_en_install_failure_dialog=$'JSAUX PIXEL installation failed.\n\nKeep the installation log on the Desktop.\nLog: %s'
JSAUX_UI_en_install_keep_log='Keep this window and the log file.'
JSAUX_UI_en_install_log_delete_warning='Warning: could not remove the install log: %s'
JSAUX_UI_en_close_prompt='Press Enter to close this window.'
JSAUX_UI_en_uninstall_start='Uninstalling JSAUX PIXEL...'
JSAUX_UI_en_admin_required='Administrator access is required. Run: sudo %s'
JSAUX_UI_en_uninstall_success_dialog=$'JSAUX PIXEL uninstallation completed.\n\nDesktop Mode, the Decky Gaming Mode plugin, and all related settings, data, logs, caches, and backups were removed.'
JSAUX_UI_en_uninstall_done_short='Uninstallation completed.'
JSAUX_UI_en_uninstall_failure_short='Uninstallation failed (code: %s).'
JSAUX_UI_en_uninstall_failure_dialog=$'JSAUX PIXEL uninstallation failed.\n\nThe removal of all software files could not be confirmed. Run the uninstaller again.\nError code: %s'
JSAUX_UI_en_target_home_missing='Target user does not exist or has no home directory: %s'
JSAUX_UI_en_target_user_missing='Target user does not exist: %s'
JSAUX_UI_en_unsafe_home='Refusing to uninstall from an unsafe target home: %s'
JSAUX_UI_en_uninstall_stop='Stopping JSAUX PIXEL services...'
JSAUX_UI_en_uninstall_remove='Removing JSAUX PIXEL files and data...'
JSAUX_UI_en_uninstall_refresh='Refreshing application menus...'
JSAUX_UI_en_uninstall_done='Uninstalled JSAUX PIXEL and removed all settings, data, logs, caches, and backups.'
JSAUX_UI_en_required_file_missing='Required release file not found: %s'
JSAUX_UI_en_runtime_file_missing='Offline runtime file not found: %s'
JSAUX_UI_en_ai_agent_verify='==> Checking the optional AI Agent module'
JSAUX_UI_en_ai_agent_verify_failed='AI Agent module check failed (safe to ignore; this tip has no login component).'
JSAUX_UI_en_linux_only='JSAUX PIXEL can only be installed on SteamOS/Linux.'
JSAUX_UI_en_x86_only='JSAUX PIXEL requires an x86_64 Steam Machine.'
JSAUX_UI_en_command_missing='Required system command not found: %s'
JSAUX_UI_en_sha_missing='Cannot verify the offline package because sha256sum is missing.'
JSAUX_UI_en_sums_missing='Offline checksum manifest not found: %s'
JSAUX_UI_en_verify_start='==> Verifying the offline package'
JSAUX_UI_en_verify_failed='Offline verification failed. Extract the ZIP again.'
JSAUX_UI_en_decky_missing='Decky Loader was not found. Install Decky Loader before running this installer.'
JSAUX_UI_en_auth_missing='Neither pkexec nor sudo is available for administrator authorization.'
JSAUX_UI_en_elevate_password_locked='Administrator authorization unavailable: no password is set for this account. Run passwd in Konsole to set one, then run the installer again.'
JSAUX_UI_en_diag_title='==> Automatic JSAUX PIXEL service diagnostics'
JSAUX_UI_en_backup_start='==> Backing up the installed version'
JSAUX_UI_en_stop_previous='==> Stopping the previous version'
JSAUX_UI_en_native_install='==> Installing the desktop application and service'
JSAUX_UI_en_decky_install='==> Installing the verified Decky runtime bundle'
JSAUX_UI_en_start_service='==> Starting JSAUX PIXEL'
JSAUX_UI_en_verify_services='==> Verifying the installed services'
JSAUX_UI_en_daemon_health_failed='JSAUX PIXEL daemon did not pass its health check. Backup: %s'
JSAUX_UI_en_service_inactive='JSAUX PIXEL daemon service is not active. Backup: %s'
JSAUX_UI_en_loader_inactive='Decky Loader did not restart successfully. Backup: %s'
JSAUX_UI_en_installed='JSAUX PIXEL V1.2 installed.'
JSAUX_UI_en_backup_path='Backup: %s'
JSAUX_UI_en_desktop_app_path='Desktop app: %s'
JSAUX_UI_en_decky_path='Decky plugin: %s'
JSAUX_UI_en_shortcut_path='Desktop shortcut: %s'
jsaux_ui() {
  local key="${1:-}" variable format
  shift || true
  variable="JSAUX_UI_${JSAUX_UI_LANGUAGE:-en}_${key}"
  eval "format=\${$variable-}"
  if [[ -z "$format" ]]; then
    variable="JSAUX_UI_en_${key}"
    eval "format=\${$variable-$key}"
  fi
  printf "$format\n" "$@"
}
