new Vue({
	el: "#app",
	data: {
		status :'',
		title: '',
		message: '',
		quizzes: [],
		correct: null,
		current: null,
		level: '',
		genre: '',
		choices: [],  
	},
	created: function(){
		this.status = 'init'
	},
	methods: {
		getQuiz: function(){
			// 取得中の表示に切り替え
			this.status = "load"
			
			// fetchを用いたJSONデータの取得
			// 参考：https://blog.capilano-fw.com/?p=6646
			fetch('https://opentdb.com/api.php?amount=10')
				.then((response) => {
					return response.json();
				})
				.then(data => { // JSONデータの取得
					// console.log(data);

					// 配列にクイズデータを投入
					this.quizzes = [];
					for(let i=0; i<data.results.length; i++){

						// クイズの基礎情報（設問、ジャンル、難易度）
						let quizzes = [];
						quizzes.question = data.results[i].question
						quizzes.genre = data.results[i].category
						quizzes.level = data.results[i].difficulty

						// 選択肢の設定
						let choices = [];
						for(let j=0; j<data.results[i].incorrect_answers.length; j++){
							choices.push({text : data.results[i].incorrect_answers[j], correct : false});
						}
						choices.push({text : data.results[i].correct_answer, correct : true});

						// 選択肢をランダムに並び替えて設問配列に追加
						quizzes.choices = this.shuffle(choices);
						this.quizzes.push(quizzes);
					}
					// ステータスを変更しクイズを表示
					this.current = 0
					this.correct = 0
					this.status = 'question'
				})
				.catch(error => { // エラー処理
					// console.log(error);
					this.status = 'error'
				});
		},
		selectChoice: function(val){
			if(this.quizzes[this.current].choices[val].correct) this.correct ++;
			// クイズ配列の長さ以下の場合はincrement
			if(this.current < (this.quizzes.length - 1)){
				this.current ++;
			}
			// それ以外の場合は結果表示
			else{
				this.status = 'result'
			}
		},
		shuffle: function(array) {
			for (let i = array.length - 1; i >= 0; i--) {
				const r = Math.floor(Math.random() * (i + 1));
				[array[i], array[r]] = [array[r], array[i]];
			}
			return array;
		}
	},
	watch: {
		current: function (value) { // 問題番号更新
			this.title = `問題${value+1}`
			this.level =  this.quizzes[value].level
			this.genre =  this.quizzes[value].genre
			this.message =  this.quizzes[value].question
			this.choices = this.quizzes[value].choices
		},
		status: function (value) { // ステータス更新
			switch(value){
				case 'init':
					this.title= "ようこそ"
					this.message= "以下のボタンをクリック"
					break;
				case 'load':
					this.title = "取得中"
					this.message = "少々お待ちください"
					break;
				case'result':
					this.title = `あなたの正答数は${this.correct}です！！`
					this.message = '再度チャレンジしたい場合は以下をクリック！！'
					break;
				case 'error':
					this.title = 'エラー'
					this.message = 'クイズの取得に失敗しました。'
					break;
			}
		},
	  },
  })