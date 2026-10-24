from __future__ import annotations

import asyncio
import json
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlparse


@dataclass
class DaemonHttpClient:
    base_url: str = "http://127.0.0.1:39052"
    timeout: float = 2.0

    def _request_timeout(self, method: str, path: str) -> float:
        # 素材导入、切换和删除可能包含压缩或设备写入，需要留出完成时间。
        if method == "POST" and urlparse(path).path.startswith("/v1/custom/assets/"):
            return max(self.timeout, 120.0)
        return self.timeout

    def get(self, path: str) -> dict[str, Any]:
        return self._request("GET", path)

    def post(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._request("POST", path, payload)

    def put(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._request("PUT", path, payload)

    async def aget(self, path: str) -> dict[str, Any]:
        return await self._arequest("GET", path)

    async def apost(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._arequest("POST", path, payload)

    async def aput(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._arequest("PUT", path, payload)

    def _request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        data = None if payload is None else json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}{path}",
            data=data,
            method=method,
            headers={"Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=self._request_timeout(method, path)) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8") if exc.fp else ""
            raise RuntimeError(body or f"Daemon returned HTTP {exc.code}") from exc
        except urllib.error.URLError as exc:
            raise RuntimeError(f"Unable to reach daemon: {exc.reason}") from exc

    async def _arequest(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        parsed = urlparse(f"{self.base_url}{path}")
        if parsed.scheme and parsed.scheme != "http":
            raise RuntimeError(f"Unsupported daemon URL scheme: {parsed.scheme}")

        host = parsed.hostname or "127.0.0.1"
        port = parsed.port or 80
        target = parsed.path or "/"
        if parsed.query:
            target = f"{target}?{parsed.query}"

        body = None if payload is None else json.dumps(payload).encode("utf-8")

        async def run() -> dict[str, Any]:
            reader, writer = await asyncio.open_connection(host, port)
            try:
                headers = [
                    f"{method} {target} HTTP/1.1",
                    f"Host: {host}:{port}",
                    "Accept: application/json",
                    "Connection: close",
                ]
                if body is not None:
                    headers.append("Content-Type: application/json")
                    headers.append(f"Content-Length: {len(body)}")

                request = ("\r\n".join(headers) + "\r\n\r\n").encode("utf-8")
                writer.write(request)
                if body is not None:
                    writer.write(body)
                await writer.drain()

                status_line = await reader.readline()
                if not status_line:
                    raise RuntimeError("Daemon returned an empty response")

                try:
                    _http_version, status_code, _reason = status_line.decode("utf-8").strip().split(" ", 2)
                except ValueError as exc:
                    raise RuntimeError(f"Unable to parse daemon response: {status_line!r}") from exc

                response_headers: dict[str, str] = {}
                while True:
                    line = await reader.readline()
                    if line in (b"\r\n", b"\n", b""):
                        break
                    key, _, value = line.decode("utf-8").partition(":")
                    response_headers[key.strip().lower()] = value.strip()

                if "content-length" in response_headers:
                    response_body = await reader.readexactly(int(response_headers["content-length"]))
                else:
                    response_body = await reader.read()

                text = response_body.decode("utf-8") if response_body else ""
                if int(status_code) >= 400:
                    raise RuntimeError(text or f"Daemon returned HTTP {status_code}")
                return json.loads(text) if text else {}
            finally:
                writer.close()
                await writer.wait_closed()

        try:
            return await asyncio.wait_for(run(), timeout=self._request_timeout(method, path))
        except TimeoutError as exc:
            raise RuntimeError("Timed out waiting for daemon response") from exc
        except OSError as exc:
            raise RuntimeError(f"Unable to reach daemon: {exc.strerror or exc}") from exc
